const fs = require("fs");

const fetch = require("node-fetch");
const helpers = require("./helpers.js");

const config = require("./config.json");
const aboutPackage = require("./package.json");
const convert = require("./convert.js");
const validateServices = require("./validateValueMap.js");

const { validateValueMap } = validateServices;
const { convertToFHIR } = convert;
const splitNumber = config.base.split("/").length;

const allowableQuery = {
  maps: {
    uid: true,
    name: true,
  },
  questionnaires: {
    uid: true,
    name: true,
  },
};

const checkTable = (table) =>
  Object.prototype.hasOwnProperty.call(allowableQuery, table);

const readResource = (fileName) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        console.log(err);
        reject(new Error("file not readable"));
      } else {
        resolve({ data: JSON.parse(data) });
      }
    });
  });
  return promise;
};

const writeResource = (fileName, data) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) reject(new Error(err));
      resolve({ success: true });
    });
  });
  return promise;
};

const deleteResource = (fileName) => {
  const promise = new Promise((resolve, reject) => {
    fs.unlink(fileName, (err) => {
      if (err) reject(new Error(err));
      resolve({ success: true });
    });
  });
  return promise;
};

const getAbout = (request, response) => {
  const aboutInfo = {
    appName: aboutPackage.name,
    version: aboutPackage.version,
    buildDate: aboutPackage.buildDate,
    repository: aboutPackage.repository,
  };
  response.status(200).json(aboutInfo);
};

const getFileTypes = (request, response) => {
  const fileTypes = ["CSV", "JSON"];
  response.status(200).json(fileTypes);
};

const getAll = (request, response) => {
  const type = request.path.split("/")[splitNumber];
  if (!checkTable(type)) {
    response.status(403).end("Invalid\n");
  }
  try {
    readResource(`${config.persistencyLocation + type}/${type}.json`).then(
      (data) => {
        const cleanedData = Object.values(data.data);
        response.status(200).json(cleanedData);
      }
    );
  } catch (e) {
    response.status(400).end(e);
  }
};

const getFHIRQuestionnaires = (request, response) => {
  fetch(`${config.fhirServer}/Questionnaire?_format=json`)
    .then((r) => {
      if (r.status < 200 || r.status >= 300) {
        response
          .status(400)
          .send("Unable to retrieve Questionnaires from FHIR Server");
      }
      return r.json();
    })
    .then((data) => {
      response.status(200).end(JSON.stringify(data.entry));
    })
    .catch((e) => {
      response.status(400).send(e);
    });
};

const checkForSpecificProp = (value, resource, prop) => {
  const promise = new Promise((resolve, reject) => {
    readResource(`${config.persistencyLocation + resource}/${resource}.json`)
      .then((data) => {
        const d = Object.values(data.data).filter((i) => i[prop] === value);
        const res = d.length ? d[0].uid : false;
        resolve(res);
      })
      .catch(() => {
        reject(new Error("Unable to read resource"));
      });
  });
  return promise;
};

const checkName = (request, response) => {
  const type = request.path.split("/")[splitNumber];
  if (!checkTable(type)) {
    response.status(403).end("Invalid\n");
  }
  checkForSpecificProp(request.params.name, "maps", "name")
    .then((nameFound) => {
      if (nameFound) {
        response.status(200).send(nameFound);
      } else {
        response.status(200).send({});
      }
    })
    .catch((e) => {
      response.status(400).send({ error: e });
    });
};

const getSpecificResource = (request, response) => {
  const type = request.path.split("/")[splitNumber];
  if (!checkTable(type)) {
    response.status(403).end("Invalid\n");
  }
  readResource(`${config.persistencyLocation + type}/${request.params.id}.json`)
    .then((data) => {
      if (data.data) response.status(200).json(data.data);
      response.status(400).end("problem accessing resource");
    })
    .catch(() => {
      response.status(404).end("not found");
    });
};

const getValueMaps = (items, valueSetArray, tempPath) => {
  for (let i = 0; i < items.length; i += 1) {
    let tempPathCopy = [];
    if (items[i].item) {
      tempPathCopy = [...tempPath];
      tempPathCopy.push(i);
      valueSetArray = getValueMaps(items[i].item, valueSetArray, tempPathCopy);
    } else if (items[i].answerValueSet) {
      tempPathCopy = [...tempPath];
      tempPathCopy.push(i);

      const fetchURL = `${config.fhirServer}/ValueSet?url=${encodeURI(
        items[i].answerValueSet
      )}&_format=json`;
      valueSetArray.push({ fetchURL, path: tempPathCopy });
    }
  }
  return valueSetArray;
};

const loadValueMaps = (items, vs) => {
  if (vs[1].length > 1) {
    const newPath = vs[1].slice(1);
    items[vs[1][0]].item = loadValueMaps(items[vs[1][0]].item, [
      vs[0],
      newPath,
    ]);
  } else {
    items[vs[1][0]].answerValueSet = {};
    [items[vs[1][0]].answerValueSet.concept] = vs;
  }
  return items;
};

const getSpecificQuestionnaire = (request, response) => {
  fetch(
    `${config.fhirServer}/Questionnaire/?url=${encodeURI(
      request.params.id
    )}&_format=json`
  )
    .then((r) => {
      if (r.status < 200 || r.status >= 300) {
        response
          .status(400)
          .send("Unable to retrieve Questionnaires from FHIR Server");
      }
      return r.json();
    })
    .then((data) => {
      const questionnaire = data.entry[0];
      let valueSetURLS = [];
      valueSetURLS = getValueMaps(questionnaire.resource.item, [], []);
      Promise.all(
        valueSetURLS.map((url) =>
          fetch(url.fetchURL)
            .then((res) => res.json())
            .then((res) => {
              if (
                res &&
                res.entry &&
                res.entry[0].resource &&
                res.entry[0].resource.id
              ) {
                return {
                  url: `${config.fhirServer}/ValueSet/${res.entry[0].resource.id}/$expand?_format=json`,
                  path: url.path,
                };
              }
            })
        )
      )
        .catch((e) => {
          console.log(e);
          response.status(400).json({
            message: "Unable to retrieve Value Sets from FHIR Server",
          });
        })
        .then((valueSetIDURLs) => {
          Promise.all(
            valueSetIDURLs.map((vs) =>
              fetch(vs.url)
                .then((res2) => res2.json())
                .then((res2) => {
                  const valueSetSummary = [[], vs.path];
                  if (res2 && res2.expansion && res2.expansion.contains) {
                    valueSetSummary[0] = res2.expansion.contains;
                  } else if (
                    res2 &&
                    res2.compose &&
                    res2.compose.include &&
                    res2.compose.include[0].concept
                  ) {
                    valueSetSummary[0] = res2.compose.include[0].concept;
                    if (res2.compose.include[0].system) {
                      valueSetSummary[0].map((x) =>
                        Object.assign(x, {
                          system: res2.compose.include[0].system,
                        })
                      );
                    }
                  }
                  return valueSetSummary;
                })
            )
          )
            .catch((e) => {
              console.log(e);
              response.status(400).json({
                message: "Unable to retrieve Value Sets from FHIR Server",
              });
            })
            .then((valueSets) => {
              valueSets.forEach((vs) => {
                questionnaire.resource.item = loadValueMaps(
                  questionnaire.resource.item,
                  vs
                );
              });
              response.status(200).end(JSON.stringify(questionnaire));
            });
        });
    });
};

const checkForUID = (uid, resource) => {
  const promise = new Promise((resolve, reject) => {
    readResource(`${config.persistencyLocation + resource}/${resource}.json`)
      .then((data) => {
        resolve(Object.prototype.hasOwnProperty.call(data.data, "uid"));
      })
      .catch(() => {
        reject(new Error("Item not readable"));
      });
  });
  return promise;
};

const addToSummary = (initialPayload, uid, endpoint) => {
  const payload = initialPayload;
  const promise = new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    if (!payload.created) {
      payload.created = now;
    }
    if (!payload.updated) {
      payload.updated = now;
    }
    if (!payload.complete) {
      payload.complete = false;
    }
    const desiredProperties = {
      maps: [
        "name",
        "created",
        "updated",
        "uid",
        "questionnaireuid",
        "complete",
        "fileType",
        "headersStructure",
      ],
      questionnaires: ["name", "created", "updated", "uid"],
    };
    const undesiredProperties = {
      maps: "map",
      questionnaires: "questionnaire",
    };
    const scrubbedObject = {};

    for (let i = 0; i < desiredProperties[endpoint].length; i += 1) {
      scrubbedObject[desiredProperties[endpoint][i]] =
        payload[desiredProperties[endpoint][i]];
    }
    readResource(`${config.persistencyLocation + endpoint}/${endpoint}.json`)
      .then((readFile) => {
        const file = readFile;
        if (file.data) {
          file.data[uid] = scrubbedObject;
          writeResource(
            `${config.persistencyLocation + endpoint}/${endpoint}.json`,
            JSON.stringify(file.data)
          ).then((status) => {
            if (status.success) {
              // add back in map or questionnaire
              scrubbedObject[undesiredProperties[endpoint]] =
                payload[undesiredProperties[endpoint]];
              resolve(scrubbedObject);
            } else {
              resolve(file);
            }
          });
        } else {
          resolve(file);
        }
      })
      .catch(() => {
        reject(new Error("could not add"));
      });
  });
  return promise;
};

const validateMapPayload = (payload, uid, update) => {
  const promise = new Promise((resolve, reject) => {
    if (!payload.name) {
      resolve("Name is required");
    }
    if (!payload.questionnaireuid) {
      resolve("Questionnaire UID is required");
    }
    if (update) {
      resolve(true);
    }

    checkForSpecificProp(payload.name.replace(/'/gi, "''"), "maps", "name")
      .then((nameConflict) => {
        if (nameConflict) {
          resolve(
            `Name (${payload.name}) already exists(, or request is invalid)`
          );
        }
        resolve(true);
      })
      .catch(() => {
        reject(new Error("problem with validation"));
      });
  });
  return promise;
};

const validateValueMapPayload = (request, response) => {
  validateValueMap(request.body).then((res) => {
    response.status(200).json(res);
  });
};

const updateMapFiles = (request, response, uid, update) => {
  validateMapPayload(request.body, uid, update).then((validity) => {
    if (validity === true) {
      addToSummary(request.body, uid, "maps").then((result) => {
        try {
          writeResource(
            `${config.persistencyLocation}maps/${uid}.json`,
            JSON.stringify(result)
          ).then((writeStatus) => {
            if (writeStatus.success) {
              response.status(200).json({ uid, message: "success" });
            }
          });
        } catch (e) {
          response.status(400).end(e);
        }
      });
    } else {
      response.status(400).end(`Problem with payload: ${validity}\n`);
    }
  });
};

const createMap = (request, response) => {
  let uid = helpers.generateUID(); // should define as random at first and then redefine

  if (request.body.uid) {
    uid = request.body.uid;
  } else {
    request.body.uid = uid;
  }

  checkForUID(uid, "maps").then((uidFound) => {
    if (uidFound) {
      response
        .status(400)
        .end(
          `The uid provided/generated (${uid}) already exists. Please update and try again.\n`
        );
    } else {
      updateMapFiles(request, response, uid, false);
    }
  });
};

const updateMap = (request, response) => {
  if (!request.body.uid) {
    response.status(400).end("Missing uid\n");
  }
  const { uid } = request.body;
  updateMapFiles(request, response, uid, true);
};

// generalized for questionnaires...however this is just for development convenience.
// a real method to delete questionnaire needs to remove maps tied to questionnaire (or fail until maps are removed)
const deleteSpecificResource = (request, response) => {
  const type = request.path.split("/")[splitNumber];
  if (!checkTable(type)) {
    response.status(403).end("Invalid\n");
  }
  const indType = type.substring(0, type.length - 1);
  const uid = request.params.id;
  readResource(`${config.persistencyLocation + type}/${type}.json`)
    .then((readFile) => {
      const file = readFile;
      if (file.data) {
        if (file.data.uid) {
          delete file.data[uid];
          try {
            writeResource(
              `${config.persistencyLocation + type}/${type}.json`,
              JSON.stringify(file.data)
            ).then(() => {
              deleteResource(
                `${config.persistencyLocation + type}/${uid}.json`
              ).then(() => {
                response
                  .status(200)
                  .send(`Removed ${indType} with uid of ${uid}`);
              });
            });
          } catch (e) {
            response.status(400).end(e);
          }
        }
      }
    })
    .catch((e) => {
      response.status(400).end(JSON.stringify(e));
    });
};

// there are no validation checks here because users will not being interacting with this route
// call is added for convenience of developing/deploying
const createQuestionnaire = (request, response) => {
  const payload = request.body;
  let uid = helpers.generateUID(); // should define as random at first and then redefine
  if (payload.uid) {
    uid = payload.uid;
  } else {
    payload.uid = uid;
  }
  const now = new Date().toISOString();
  if (!payload.created) {
    payload.created = now;
  }
  if (!payload.updated) {
    payload.updated = now;
  }
  addToSummary(request.body, uid, "questionnaires").then((result) => {
    try {
      writeResource(
        `${config.persistencyLocation}questionnaires/${uid}.json`,
        JSON.stringify(result)
      ).then((writeStatus) => {
        if (writeStatus.success) {
          response
            .status(200)
            .json(
              `{"uid": "${uid}", "message":` +
                `"Uploaded questionnaire for: ${uid}"}`
            );
        }
      });
    } catch (e) {
      response.status(400).end(JSON.stringify(e));
    }
  });
};

const uploadData = (request, response) => {
  const url = decodeURIComponent(request.query.url);
  try {
    readResource(`${config.persistencyLocation}maps/${request.params.id}.json`)
      .then((data) => {
        if (data.data) {
          const map = { map: data.data.map, fileType: data.data.fileType };
          readResource(
            `${config.persistencyLocation}maps/${request.params.id}.json`
          )
            .then((dataQ) => {
              if (dataQ.data) {
                const questionnaireURL = dataQ.data.questionnaireuid;
                convertToFHIR(
                  request.body,
                  map,
                  request.params.id,
                  questionnaireURL
                ).then((result) => {
                  if (result.erros) {
                    response.status(200).json(result);
                  } else if (
                    url === null ||
                    url.trim().toLowerCase() === "null"
                  ) {
                    response.status(200).json(result);
                  } else {
                    try {
                      fetch(url, {
                        method: "POST",
                        body: JSON.stringify(result.data),
                        headers: { "Content-Type": "application/json" },
                      })
                        // .then(firstRes => firstRes.text())
                        .then((extRes) => {
                          result.urlResponse = {
                            status: extRes.status,
                            url: extRes.url,
                            body: extRes.body,
                          };
                          response.status(200).json(result);
                        });
                    } catch (e) {
                      result.urlResponse = e;
                      response.status(400).json(result);
                    }
                  }
                });
              }
            })
            .catch((e) => {
              response.status(400).end(e);
            });
        }
      })
      .catch((e) => {
        response.status(400).end(e);
      });
  } catch (e) {
    response.status(400).end(e);
  }
};

module.exports = {
  getAbout,
  getAll,
  getFHIRQuestionnaires,
  getFileTypes,
  checkName,
  getSpecificResource,
  getSpecificQuestionnaire,
  createMap,
  updateMap,
  deleteSpecificResource,
  createQuestionnaire,
  uploadData,
  validateValueMapPayload,
};

generateUID = () => {
  const uidNumber = 6;
  const allowable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  uid = '';
  uid = allowable.substr(0,52)[Math.trunc(Math.random() * 52)];
  for (i=1; i<uidNumber; i++) {
    uid = uid + allowable[Math.trunc(Math.random() * allowable.length)];
  }
  return uid
}

module.exports = {
  generateUID
}

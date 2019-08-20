generateUID = () => {
  const uidNumber = 6;
  const allowable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  uid = '';
  for (i=0; i<uidNumber; i++) {
    uid = uid + allowable[Math.trunc(Math.random() * allowable.length)];
  }
  return uid
}

module.exports = {
  generateUID
}

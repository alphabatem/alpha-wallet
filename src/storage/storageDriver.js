export class StorageDriver {

  async getSession(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.session.get([key], function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  async setSession(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.session.set({key: value}, function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  async getLocal(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  async setLocal(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({key: value}, function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };
}

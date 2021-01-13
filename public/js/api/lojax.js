function lojax(method, route, params) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        resolve(xhttp.responseText);
      } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        resolve(xhttp.status);
      }
    };
    xhttp.open(method, route, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(params));
  });
}

module.exports = {
  create: function (model, params) {
    const method = 'POST';
    const route = '/api/' + model + 's';
    return new Promise((resolve, reject) => {
      lojax(method, route, params)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
  read: function (model, params) {
    const method = 'GET';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else if (params.email && model === 'user') {
      route = '/api/' + model + 's/' + params.email;
    }
    return new Promise((resolve, reject) => {
      lojax(method, route, params)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
  update: function (model, params) {
    const method = 'PUT';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Update requires an id!';
    }
    return new Promise((resolve, reject) => {
      lojax(method, route, params)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
  delete: function (model, params) {
    const method = 'DELETE';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Delete requires an id!';
    }
    return new Promise((resolve, reject) => {
      lojax(method, route, params)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
  logout: function () {
    const method = 'POST';
    const route = '/api/users/logout';
    return new Promise((resolve, reject) => {
      lojax(method, route)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
  login: function (email, password) {
    const method = 'POST';
    const route = '/api/users/login';
    return new Promise((resolve, reject) => {
      lojax(method, route, { email, password })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
};

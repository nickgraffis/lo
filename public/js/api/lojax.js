function lojax(method, route, params) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        resolve(xhttp.responseText);
      } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        resolve(xhttp.responseText);
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
    return lojax(method, route, params)
  },
  read: function (model, params) {
    const method = 'GET';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else if (params.email && model === 'user') {
      route = '/api/' + model + 's/' + params.email;
    }
    return lojax(method, route, params)
  },
  update: function (model, params) {
    const method = 'PUT';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Update requires an id!';
    }
    return lojax(method, route, params)
  },
  delete: function (model, params) {
    const method = 'DELETE';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Delete requires an id!';
    }
    return lojax(method, route, params)
  },
  logout: function () {
    const method = 'POST';
    const route = '/api/users/logout';
    return lojax(method, route)
  },
  login: function (email, password) {
    const method = 'POST';
    const route = '/api/users/login';
    return lojax(method, route, { email, password })
  },
};

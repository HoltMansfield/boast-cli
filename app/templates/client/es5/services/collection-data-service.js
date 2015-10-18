angular
  .module('{{ moduleName }}')
  .factory('{{ collectionName }}Data', function(server) {
    var service = {};
    var urlFragment = '{{ collectionNamePlural }}';

    service.get = function(id) {
      var url = urlFragment + '/' +id;

      return server.get(url);
    };

    service.getAll = function() {
      var url = urlFragment;

      return server.get(url);
    };

    service.post = function({{ collectionName }}) {
      return server.post(urlFragment, {{ collectionName }});
    };

    service.put = function({{ collectionName }}) {
      var url = urlFragment + '/' +id;

      return server.put(url, {{ collectionName }});
    };

    return service;
  });

angular.isUndefinedOrNull = function(obj){
    return angular.isUndefined(obj) || obj === null;
};

angular.isUndefinedOrNullOrEmpty = function (obj) {
    return angular.isUndefined(obj) || obj === null ||  obj.length === 0 || typeof obj === 'object' && Object.keys(obj).length === 0;
};
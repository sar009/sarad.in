var requestJson = function(fileName, callback) {
    $.ajax({
        url: "/assets/json/" + fileName + ".json",
        method: "GET",
        data: {
            js_version: __JS_VERSION__
        }
    }).done(function (response) {
        callback(response);
    });
};

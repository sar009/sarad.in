var requestJson = function(fileName, callback) {
    $.ajax({
        url: "/assets/json/" + fileName + ".json",
        method: "GET"
    }).done(function (response) {
        callback(response);
    });
};

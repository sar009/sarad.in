var loadBlogIndex = function () {
    $('.blog-loader-animation').css('display', 'inherit');
    $('.blog-index-list-container').empty();
    requestJson("blog_index", function (response) {
        var listContent = "";
        response.forEach(function (eachItem) {
            var publishDate = new Date(eachItem.published_at);
            listContent += '<a href="/' + eachItem.href + '" class="blog-item-link"><div class="item">' +
                    '<div class="title">' + eachItem.title + '</div>' +
                    '<div class="sub-title">' + eachItem.desc + '</div>' +
                    '<div class="time">' + publishDate.toDateString() + '</div>' +
                '</div></a>';
        });
        $('.blog-loader-animation').css('display', 'none');
        $('.blog-index-list-container').prepend($(listContent));
    });
};

var loadBlogIndex = function () {
    requestJson("blog_index", function (response) {
        response.forEach(function (eachItem) {
            var publishDate = new Date(eachItem.published_at);
            var blogItem = '<a href="/' + eachItem.href + '" class="blog-item-link"><div class="item">' +
                    '<div class="title">' + eachItem.title + '</div>' +
                    '<div class="sub-title">' + eachItem.desc + '</div>' +
                    '<div class="time">' + publishDate.toDateString() + '</div>' +
                '</div></a>';
            $('.blog-index-list-container').prepend($(blogItem));
        });
    });
};

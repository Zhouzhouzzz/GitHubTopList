// var Helper = {
//     isToBottom: function ($viewport, $content) {
//         return $viewport.height() + $viewport.scrollTop() + 20 > $content.height()
//     }
// }

// var Paging = {
//     init: function () {
//         this.$tabs = $('footer>div');
//         this.$pages = $('main>section');
//         this.bind();
//     },
//     bind: function () {
//         var _this = this;
//         this.$tabs.on('click', function () {
//             var $this = $(this);
//             var index = $this.index();
//             $this.addClass('active').siblings().removeClass('active')
//             _this.$pages.eq(index).fadeIn().siblings().fadeOut()
//         })
//     }
// }


//获取repos的ajax请求
var index = 1,
    pageRepos = 1,
    pageUsers = 1;

function getTopRepos(pages, keyword, num) {
    $.ajax({
        url: 'https://api.github.com/search/repositories?sort=stars&order=desc',
        dataType: 'json',
        type: 'get',
        data: {
            page: pages,
            q: keyword,
        },
        success: function (data) {
            data.items.forEach(function (item) {
                var tmp = `<a class="clearfix" href="#">
                    <p></p>
                    <div>
                        <h2></h2>
                        <p></p>
                        <p><span></span><span> stars</span></p>
                    </div>
                </a>
                <hr>`
                var $node = $(tmp);
                $node.find('p:nth-child(1)').text(index);
                $node.find('h2').text(item.name);
                $node.find('p:nth-child(2)').text(item.description);
                $node.find('p:nth-child(3)>span:nth-child(1)').text(item.stargazers_count);
                index++;
                $('section').eq(num).append($node);
            });

            pageRepos++;
        },
        error: function () {
            alert('error!');
        }
    })
}

//获取user的ajax请求

function getTopUser() {
    $.ajax({
        url: 'https://api.github.com/search/users?q=followers:>1000+language:javascript',
        dataType: 'json',
        type: 'get',
        data: {
            page: pageUsers,
        },
        success: function (data) {
            data.items.forEach(function (item) {
                var tmp = `<a href="#" class="clearfix">
                <img>
                <h2></h2>
            </a>
            <hr>`
                var $node = $(tmp);
                $node.find('img').prop('src', item.avatar_url);
                $node.find('h2').text(item.login);
                $('section').eq(1).append($node);
                pageUsers++;
            });

        },
        error: function () {
            alert('error!');
        }
    })
}

// getTopUser();
//getTopRepos(pageSearch, 'console.log()', 2);
getTopRepos(pageRepos, 'language:javascript', 0);



$('footer div:first-child').click(function () {
    $(this).addClass('active').siblings().removeClass('active')
    $('main section').eq(0).fadeIn().siblings().fadeOut()
    getTopRepos(pageRepos, 'language:javascript', 0);
})

$('footer div:nth-child(2)').click(function () {
    $(this).addClass('active').siblings().removeClass('active')
    $('main section').eq(1).fadeIn().siblings().fadeOut()
    getTopUser();
})

$('footer div:nth-child(3)').click(function () {
    $(this).addClass('active').siblings().removeClass('active')
    $('main section').eq(2).fadeIn().siblings().fadeOut()
    getTopUser();
})
$('.search-btn').click(function () {
    getTopRepos(pageRepos, $('#repo').val(), 2);
})

var timeOut = 0;
$('main').scroll(function () {
    if ($('section').eq(0).hasClass('active')) {
        if ($('main').scrollTop() + $('main').height() == $('section').eq(0).height()) {
            var timeOut = setTimeout(getTopRepos(pageRepos, 'language:javascript', 0), 1000)
        }
    }
    if ($('section').eq(1).hasClass('active')) {
        if ($('main').scrollTop() + $('main').height() == $('section').eq(1).height()) {
            getTopUser();
        }
    }
    if ($('section').eq(2).hasClass('active')) {
        if ($('main').scrollTop() + $('main').height() == $('section').eq(2).height()) {
            getTopRepos(pageRepos, $('#repo').val(), 2);
        }
    }
})
var index = 1,
    pageRepos = 1,
    pageUsers = 1,
    pageSearch = 1,
    _index = 1;

var isLoading = false,
    timeOut = 0;

//获取repos的ajax请求
function getTopRepos(pages, keyword, num, flag) {
    if (isLoading) return;
    isLoading = true;
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
                if (flag == 1) {
                    $node.find('p:nth-child(1)').text(index);
                    //console.log(index)
                    index++;
                } else {
                    $node.find('p:nth-child(1)').text(_index);
                    _index++;
                }
                $node.find('h2').text(item.name);
                $node.find('p:nth-child(2)').text(item.description);
                $node.find('p:nth-child(3)>span:nth-child(1)').text(item.stargazers_count);

                $('section').eq(num).append($node);
            });
            if (flag == 1) {
                pageRepos++;
            } else {
                pageSearch++;
            }

        },
        error: function () {
            console.log('error!');
        }
    }).always(function () {
        isLoading = false;
    })
}

//获取user的ajax请求
function getTopUser() {
    if (isLoading) return;
    isLoading = true;
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
            });
            pageUsers++;

        },
        error: function () {
            alert('error!');
        }
    }).always(function () {
        isLoading = false;
    })
}
//tab以及展示面板的设置
function addActive(ind) {
    $('footer div:nth-child(' + (ind + 1) + ')').addClass('active').siblings().removeClass('active');
    $('main section').eq(ind).addClass('active').siblings().removeClass('active');
}

//界面滚动函数



function scrollFun(handler, ind) {
    if ($('main').scrollTop() + $('main').height() == $('section').eq(ind).height()) {
        if (timeOut == 0) {
            timeOut = setTimeout(handler, 1000);
        } else {
            clearTimeout(timeOut);
            timeOut = 0;
        }
    }
}


//界面初始加载
getTopRepos(pageRepos, 'language:javascript', 0, 1);;

//tabs的点击事件
$('footer div').click(function (e) {
    if ($(e.target).html() == 'Top repos' || ($(e.target).siblings().html() == 'Top repos')) {
        addActive(0);
        getTopRepos(pageRepos, 'language:javascript', 0, 1);
    } else if ($(e.target).html() == 'Top users' || ($(e.target).siblings().html() == 'Top users')) {
        addActive(1);
        getTopUser();
    } else {
        addActive(2);

    }
})

$('.search-btn').click(function () {
    getTopRepos(pageRepos, $('#repo').val(), 2, 3);
})

$('main').scroll(function () {
    var indexScr = $('section.active').index();
    switch (indexScr) {
        case 0:
            scrollFun(function () {
                getTopRepos(pageRepos, 'language:javascript', 0, 1)
            }, 0);
            break;
        case 1:
            scrollFun(function () {
                getTopUser()
            }, 1);
            break;
        case 2:
            scrollFun(function () {
                getTopRepos(pageRepos, $('#repo').val(), 2, 3);
            }, 2);
            break;
    }
})

$(function () {
    "use strict";

    function onResize () {
        $('.main').css('height', window.innerHeight + 'px');
    }
    onResize();
    $(window).resize(onResize);

    var htmlConvert = document.createElement('div');
    function encodeHTML(text) {
        htmlConvert.textContent = text;
        return htmlConvert.innerHTML.replace(/\"/g, '&quot;');
    }

    var iCat, lenCat = shader_showcase.categories.length, iShader, lenShader = shader_showcase.shaders.length;
    var cat, shader, eleCat, eleShader, eleShaderCollection, hasShaders;
    var $sideNav = $('.bs-sidenav'), activeCat = ' class="active"';

    for (iCat = 0; iCat < lenCat; ++iCat) {
        cat = shader_showcase.categories[iCat];
        eleCat = document.createElement('div');
        eleCat.className = 'category';
        eleCat.innerHTML = '<h2 id="cat' + iCat + '">' + cat.name + '</h2>';
        if (cat.desc) {
	        eleCat.innerHTML += '<p>' + cat.desc + '</p>';
        }
        eleShaderCollection = document.createElement('div');
        eleShaderCollection.className = 'collection';
        eleCat.appendChild(eleShaderCollection);
        hasShaders = false;
        for (iShader = 0; iShader < lenShader; ++iShader) {
            shader = shader_showcase.shaders[iShader];
            if ($.inArray(cat.id, shader.cat) >= 0) {
                hasShaders = true;
                var title = shader.name;
                if (shader.desc) {
                    title += '\n' + shader.desc;
                }
                eleShader = document.createElement('span');
                eleShader.innerHTML = '<a class="shader" title="' + encodeHTML(title) + '" href="http://glsl.heroku.com/e#' + shader.e +
                    '"><img src="shader_img/e' + shader.e + '.' + shader.ext + '" />' + encodeHTML(shader.name) + '</a> ';

                eleShaderCollection.appendChild(eleShader);
            }
        }
        if (hasShaders) {
            $("#categories").append(eleCat);
            $sideNav.append('<li' + activeCat + '><a href="#cat' + iCat + '">' + cat.name + '</a></li>');
            activeCat = '';
        }
    }

    // Bootstrap stuff

    var $window = $(window);
    var $body = $(document.body);

    $body.scrollspy({
        target: '.bs-sidebar',
        offset: 0
    });

    $body.on('click', '.bs-sidenav [href^=#]', function (e) {
        var $target = $(this.getAttribute('href'));

        e.preventDefault(); // prevent browser scroll

        $window.scrollTop($target.offset().top - 5);
    });

    // back to top
    setTimeout(function () {
        var $sideBar = $('.bs-sidebar');

        $sideBar.affix({
            offset: {
                top: function () {
                    var offsetTop = $sideBar.offset().top;
                    var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10);

                    return (this.top = offsetTop - sideBarMargin);
                },
                bottom: function () {
                    return (this.bottom = $('.bs-footer').outerHeight(true));
                }
            }
        });
    }, 100);

});

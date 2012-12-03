$(function () {
    "use strict";

    function onResize () {
        $('.main').css('height', window.innerHeight + 'px');
    }
    onResize();
    $(window).resize(onResize);

    var iCat, lenCat = shader_showcase.categories.length, iShader, lenShader = shader_showcase.shaders.length;
    var cat, shader, eleCat, eleShader, eleShaderCollection;

    for (iCat = 0; iCat < lenCat; ++iCat) {
        cat = shader_showcase.categories[iCat];
        eleCat = document.createElement('div');
        eleCat.className = 'category';
        eleCat.innerHTML = '<h2>' + cat.name + '</h2>';
        if (cat.desc) {
	        eleCat.innerHTML += '<p>' + cat.desc + '</p>';
        }
        eleShaderCollection = document.createElement('div');
        eleShaderCollection.className = 'collection';
        eleCat.appendChild(eleShaderCollection);
        for (iShader = 0; iShader < lenShader; ++iShader) {
            shader = shader_showcase.shaders[iShader];
            if ($.inArray(cat.id, shader.cat) >= 0) {
                eleShader = document.createElement('span');
                //eleShader.className = 'shader';
                eleShader.innerHTML = '<a class="shader" href="http://glsl.heroku.com/e#' + shader.e +
                    '"><img src="shader_img/e' + shader.e + '.' + shader.ext + '" alt="' + shader.name + '" />' + shader.name + '</a> ';

                eleShaderCollection.appendChild(eleShader);
            }
        }
        $("#categories").append(eleCat);
    }

});

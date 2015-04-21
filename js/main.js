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
                eleShader.innerHTML = '<a class="shader" title="' + encodeHTML(title) + '" href="http://glslsandbox.com/e#' + shader.e +
                    '"><img src="shader_img/e' + shader.e + '.' + shader.ext + '" />' + encodeHTML(shader.name) + '</a> ';

                eleShaderCollection.appendChild(eleShader);
            }
        }
        if (hasShaders) {
            $("#categories").append(eleCat);
        }
    }

});

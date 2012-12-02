/*global Blob*/
$(function () {
    "use strict";

    var getURL = window.URL || window.webkitURL || window;

    function onAddShader () {
        // TODO: Add new category, sanity check and trim URL.

        var categories = [];
        $.each($('.categoryCheckbox'), function (i, box) {
            if (box.checked) {
                categories.push(parseInt(box.id.substring(9), 10));
                box.checked = false;
            }
        });

        var shader = {
            e : $('#shaderUrl').attr('value'),
            ext : $('#thumbnailExt').attr('value'),
            cat : categories,
            name : $('#shaderName').attr('value'),
            desc : $('#shaderDesc').attr('value')
        };
        shader_showcase.shaders.push(shader);

        $('#shaderUrl').attr('value', '');
        $('#shaderName').attr('value', '');
        $('#shaderDesc').attr('value', '');

        var regex = new RegExp('\}\,', 'gm');
        var msg =
            'var shader_showcase = {\n\n' +
            '"categories":\n' +
            JSON.stringify(shader_showcase.categories).replace(regex, '},\n') +
            ',\n\n' +
            '"shaders":\n' +
            JSON.stringify(shader_showcase.shaders).replace(regex, '},\n') +
            '\n};\n';
        $('#output').text(msg);

        if (typeof Blob !== 'undefined') {
            var ele = document.getElementById('downloadLink');
            var octetBlob = new Blob([ msg ], { 'type' : 'application/octet-stream', 'endings' : 'native' });
            var octetBlobURL = getURL.createObjectURL(octetBlob);
            ele.innerHTML = 'Download: <a href="' + octetBlobURL +
                '" download="featured_shaders.js">featured_shaders.js</a> (with ' +
                shader_showcase.categories.length + ' categories, ' + shader_showcase.shaders.length + ' shaders)';
        }
    }

    function onResize () {
        $('.main').css('height', window.innerHeight + 'px');
    }
    onResize();
    $(window).resize(onResize);

    $('#topRight').html('Loaded:<br/>' + shader_showcase.categories.length + ' categories<br/>' +
        shader_showcase.shaders.length + ' shaders');

    var iCat, lenCat = shader_showcase.categories.length, lenShader = shader_showcase.shaders.length;
    var cat, eleCat, catID;

    for (iCat = 0; iCat < lenCat; ++iCat) {
        cat = shader_showcase.categories[iCat];
        catID = 'category_' + iCat;
        eleCat = document.createElement('div');
        eleCat.className = 'categoryToggle';
        eleCat.innerHTML = '<input id="' + catID + '" type="checkbox" class="categoryCheckbox"> ' +
            '<label for="' + catID + '">' + cat.name + '</label>';
        //if (cat.desc) {
	    //    eleCat.innerHTML += '<span class="description">' + cat.desc + '</span>';
        //}
        $("#categories").append(eleCat);
    }
    //eleCat = document.createElement('div');
    //eleCat.className = 'categoryToggle';
    //eleCat.innerHTML = 'New category: <input id="new_category" type="text">';
    //$("#categories").append(eleCat);

    $('#go').click(onAddShader);
});

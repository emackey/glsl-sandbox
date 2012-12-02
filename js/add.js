/*global Blob*/
$(function () {
    "use strict";

    var getURL = window.URL || window.webkitURL || window;
    var baseEffectURL = 'http://glsl.heroku.com/e#';
    var baseEffectURLLen = baseEffectURL.length;
    var currentE = '', currentEisValid = false;

    // Shader URL change handler & validation
    //
    function onURLchanged() {
        var url = $('#shaderUrl').attr('value').trim();
        if ((url.length > baseEffectURLLen) && (url.substring(0, baseEffectURLLen) === baseEffectURL)) {
            url = url.substring(baseEffectURLLen);
        }
        var i, len = url.length, valid = (len > 0 && len < 10), hasDot = false;
        for (i = 0; valid && (i < len); ++i) {
            var ch = url[i];
            if (ch === '.') {
                if (hasDot) {
                    valid = false;
                } else {
                    hasDot = true;
                }
            } else if ((ch < '0') || (ch > '9')) {
                valid = false;
            }
        }

        $('#go')[0].disabled = !valid;
        currentEisValid = valid;
        currentE = url;
        url = baseEffectURL + url;
        if (valid) {
            $('#computedName').text('shader_img/e' + currentE + '.');
            $('#popOut').html('<a target="shader_sample" href="' + url + '">Popout e#' + currentE + '</a>');
            if ($('#shaderUrl').attr('value') !== url) {
                $('#shaderUrl').attr('value', url);
            }
        } else {
            $('#computedName').text('shader_img/e.');
            $('#popOut').html('');
        }
    }

    $('#shaderUrl').change(onURLchanged).click(function() {
       $(this).select();
    });

    // "Add Shader" button event
    //
    function onAddShader () {
        if (!currentEisValid) {
            alert('Effect URL is invalid.');
            return;
        }

        if ($('#shaderName').attr('value').length < 1) {
            alert("Please enter the shader's name.");
            return;
        }
        // TODO: Add new category

        var categories = [];
        $.each($('.categoryCheckbox'), function (i, box) {
            if (box.checked) {
                categories.push(parseInt(box.id.substring(9), 10));
                box.checked = false;
            }
        });
        if (categories.length < 1) {
            alert("Please choose at least one category.");
            return;
        }
        shader_showcase.categories.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0);
        });

        var shader = {
            e : currentE,
            ext : $('#thumbnailExt').attr('value'),
            cat : categories,
            name : $('#shaderName').attr('value'),
            desc : $('#shaderDesc').attr('value')
        };
        shader_showcase.shaders.push(shader);
        shader_showcase.shaders.sort(function (a, b) {
            return parseFloat(a.e) - parseFloat(b.e);
        });

        $('#shaderName').attr('value', '');
        $('#shaderDesc').attr('value', '');
        $('#shaderUrl').attr('value', baseEffectURL);
        onURLchanged();

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

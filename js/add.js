/*global Blob*/
$(function () {
    "use strict";

    var getURL = window.URL || window.webkitURL || window;
    var baseEffectURL = 'http://glsl.heroku.com/e#';
    var baseEffectURLLen = baseEffectURL.length;
    var currentE = '', currentEisValid = false, currentEshader;

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

        currentE = url;
        currentEisValid = valid;
        currentEshader = undefined;
        url = baseEffectURL + url;
        if (valid) {
            $('#computedName').text('shader_img/e' + currentE + '.');
            $('#popOut').html('<a target="shader_sample" href="' + url + '">Popout e#' + currentE + '</a>');
            if ($('#shaderUrl').attr('value') !== url) {
                $('#shaderUrl').attr('value', url);
            }
            len = shader_showcase.shaders.length;
            for (i = 0; i < len; ++i) {
                var oldShader = shader_showcase.shaders[i];
                if (oldShader.e === currentE) {
                    currentEshader = oldShader;
                    $('#shaderName').attr('value', oldShader.name);
                    $('#shaderDesc').attr('value', oldShader.desc);
                    $('#thumbnailExt').attr('value', oldShader.ext);
                    $.each($('.categoryCheckbox'), function (i, box) {
                        var id = parseInt(box.id.substring(9), 10);
                        box.checked = oldShader.cat.indexOf(id) >= 0;
                    });
                } else if (Math.abs(Math.floor(parseFloat(oldShader.e)) - Math.floor(parseFloat(currentE))) < 0.01) {
                    $('#popOut').append(' &bull; <a target="shader_sample" href="http://glsl.heroku.com/diff#' +
                        oldShader.e + '-vs-' + currentE + '">Diff e#' + oldShader.e + '</a>');
                }
            }
        } else {
            $('#computedName').text('shader_img/e.');
            $('#popOut').html('');
        }
        $('#go')[0].disabled = !valid;

        if (typeof currentEshader !== 'undefined') {
            $('#go').attr('value', 'Modify shader');
        } else {
            $('#go').attr('value', 'Add shader');
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
        if (typeof currentEshader === 'undefined') {
            shader_showcase.shaders.push(shader);
            shader_showcase.shaders.sort(function (a, b) {
                return parseFloat(a.e) - parseFloat(b.e);
            });
        } else {
            currentEshader.e = shader.e;
            currentEshader.ext = shader.ext;
            currentEshader.cat = shader.cat;
            currentEshader.name = shader.name;
            currentEshader.desc = shader.desc;
        }

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
        catID = 'category_' + cat.id;
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

$(function () {
    "use strict";

    function onAddShader () {
        // TODO: Insert new shader into array.

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
    }

    function onResize () {
        $('.main').css('height', window.innerHeight + 'px');
    }
    onResize();
    $(window).resize(onResize);

    var iCat, lenCat = shader_showcase.categories.length, lenShader = shader_showcase.shaders.length;
    var cat, eleCat, catID;

    for (iCat = 0; iCat < lenCat; ++iCat) {
        cat = shader_showcase.categories[iCat];
        catID = 'category_' + iCat;
        eleCat = document.createElement('div');
        eleCat.className = 'categoryToggle';
        eleCat.innerHTML = '<input id="' + catID + '" type="checkbox"> <label for="' + catID + '">' + cat.name + '</label>';
        //if (cat.desc) {
	    //    eleCat.innerHTML += '<span class="description">' + cat.desc + '</span>';
        //}
        $("#categories").append(eleCat);
    }
    eleCat = document.createElement('div');
    eleCat.className = 'categoryToggle';
    eleCat.innerHTML = 'New category: <input id="new_category" type="text">';
    $("#categories").append(eleCat);

    $('#go').click(onAddShader);
});

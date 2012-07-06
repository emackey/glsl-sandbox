# GLSL Sandbox

## A live-editor for WebGL shaders by <a href="https://twitter.com/mrdoob">@mrdoob</a> and other contributors

Documentation effort started by <a href="https://twitter.com/emackey">@emackey</a>

### Requirements

This project requires a web browser capable of running <a href="http://get.webgl.org/">WebGL</a> such as Chrome or FireFox.
As of this writing, Opera's WebGL support is experimental and not very functional for many shaders in the Sandbox,
but this may improve in the future.  Most browsers disable WebGL on Windows XP due to security concerns with the
graphics drivers.  A modern system with nVidia or AMD graphics is highly recommended.

### Usage

There are two different ways to access the GLSL Sandbox:  The <a href="http://glsl.heroku.com/">online gallery</a>,
and an offline mode using a local copy of this Git repository.  The options for saving and loading shaders are
different depending on the mode.

### Offline use

To use your local copy, just launch `Static\index.html` into a WebGL-capable browser.  The default shader appears,
and if you edit it, you'll notice a very long hash appear in the browser's address bar.  This hash contains a
compressed copy of your entire shader, and it changes as you type (after a pause).  You can bookmark it to save a
local copy of your shader, or copy-and-paste the text to a local file.

### Online use

The real power of this project is the ability to share and evolve shaders with a large community.  Start by
clicking "<a href="http://glsl.heroku.com/e">Create new effect!</a>" or by loading any existing shader from
the <a href="http://glsl.heroku.com/">online gallery</a>.  Make any changes you like to the shader's source,
you can't overwrite another person's shader by accident.  If you like what you've done, the next button you
click will be called either `save` or `fork`.

### <img src="http://github.com/emackey/glsl-sandbox/raw/mobile-fixes/docs/SaveVsFork.png" alt="save vs. fork" width="162" height="38" /> `Save` vs. `Fork`

Regardless of the label, clicking this button immediately saves your shader into the online gallery to share
with the world.  If the label reads `fork` it means that you've made modifications to someone else's
shader, and when you click `fork` your modified version will be assigned a new effect number and get its
own thumbnail in the gallery, separate from the original.  You now "own" this new effect and can `save` further
modifications to it as new versions.

### Effect numbers

The URL for each effect contains an effect number, a dot, and a version number.  The first version is zero
for any new or newly-forked effect.  The most recent version can be referenced by leaving the version
number and the dot off the end of the URL.  For example, my brother's first attempt at GLSL abstract art
is <a href="http://glsl.heroku.com/e#375.0">`e#375.0`</a>, and after many more saves the final version is
<a href="http://glsl.heroku.com/e#375.15">`e#375.15`</a>, which can also be written as just
<a href="http://glsl.heroku.com/e#375">`e#375`</a> because it is the last version.  If you modify and fork
this effect, you'll get a new effect number, version zero.

### `Parent` and `Diff`

Forking someone else's effect is preferred over pasting their code into a new blank effect, because the
sandbox remembers the parent of a forked effect, and offers a `parent` button that links there.  It also
offers a `diff` button to compare a forked effect with its original parent.  NOTE: Save your work before
clicking either of these buttons!


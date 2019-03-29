'use strict';

define("plantworks/tests/helpers/ember-power-select", ["exports", "ember-power-select/test-support/helpers"], function (_exports, _helpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = deprecatedRegisterHelpers;
  _exports.selectChoose = _exports.touchTrigger = _exports.nativeTouch = _exports.clickTrigger = _exports.typeInSearch = _exports.triggerKeydown = _exports.nativeMouseUp = _exports.nativeMouseDown = _exports.findContains = void 0;

  function deprecateHelper(fn, name) {
    return function (...args) {
      (true && !(false) && Ember.deprecate("DEPRECATED `import { ".concat(name, " } from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import { ").concat(name, " } from 'ember-power-select/test-support/helpers';`"), false, {
        until: '1.11.0',
        id: "ember-power-select-test-support-".concat(name)
      }));
      return fn(...args);
    };
  }

  let findContains = deprecateHelper(_helpers.findContains, 'findContains');
  _exports.findContains = findContains;
  let nativeMouseDown = deprecateHelper(_helpers.nativeMouseDown, 'nativeMouseDown');
  _exports.nativeMouseDown = nativeMouseDown;
  let nativeMouseUp = deprecateHelper(_helpers.nativeMouseUp, 'nativeMouseUp');
  _exports.nativeMouseUp = nativeMouseUp;
  let triggerKeydown = deprecateHelper(_helpers.triggerKeydown, 'triggerKeydown');
  _exports.triggerKeydown = triggerKeydown;
  let typeInSearch = deprecateHelper(_helpers.typeInSearch, 'typeInSearch');
  _exports.typeInSearch = typeInSearch;
  let clickTrigger = deprecateHelper(_helpers.clickTrigger, 'clickTrigger');
  _exports.clickTrigger = clickTrigger;
  let nativeTouch = deprecateHelper(_helpers.nativeTouch, 'nativeTouch');
  _exports.nativeTouch = nativeTouch;
  let touchTrigger = deprecateHelper(_helpers.touchTrigger, 'touchTrigger');
  _exports.touchTrigger = touchTrigger;
  let selectChoose = deprecateHelper(_helpers.selectChoose, 'selectChoose');
  _exports.selectChoose = selectChoose;

  function deprecatedRegisterHelpers() {
    (true && !(false) && Ember.deprecate("DEPRECATED `import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';`", false, {
      until: '1.11.0',
      id: 'ember-power-select-test-support-register-helpers'
    }));
    return (0, _helpers.default)();
  }
});
define("plantworks/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('breakpoints.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'breakpoints.js should pass ESLint\n\n');
  });
  QUnit.test('formats.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'formats.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('transitions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transitions.js should pass ESLint\n\n');
  });
});
define("plantworks/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('plantworks/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'plantworks/templates/application.hbs should pass TemplateLint.\n\nplantworks/templates/application.hbs\n  10:29  error  Non-translated string used in `alt` attribute  no-bare-strings\n  59:34  error  Non-translated string used  no-bare-strings\n  60:102  error  Non-translated string used  no-bare-strings\n  60:143  error  Non-translated string used  no-bare-strings\n  10:47  error  elements cannot have inline styles  no-inline-styles\n  21:23  error  elements cannot have inline styles  no-inline-styles\n');
  });
  QUnit.test('plantworks/templates/head.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'plantworks/templates/head.hbs should pass TemplateLint.\n\n');
  });
});
define("plantworks/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
define("plantworks/tests/test-helper", ["plantworks/app", "plantworks/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define('plantworks/config/environment', [], function() {
  
          var exports = {
            'default': {"modulePrefix":"plantworks","environment":"test","rootURL":"/","locationType":"none","changeTracker":{"trackHasMany":true,"auto":true,"enableIsDirty":true},"contentSecurityPolicy":{"font-src":"'self' fonts.gstatic.com","style-src":"'self' fonts.googleapis.com"},"ember-google-maps":{"key":"AIzaSyDof1Dp2E9O1x5oe78cOm0nDbYcnrWiPgA","language":"en","region":"IN","protocol":"https","version":"3.34","src":"https://maps.googleapis.com/maps/api/js?v=3.34&region=IN&language=en&key=AIzaSyDof1Dp2E9O1x5oe78cOm0nDbYcnrWiPgA"},"ember-paper":{"insertFontLinks":false},"fontawesome":{"icons":{"free-solid-svg-icons":"all"}},"googleFonts":["Noto+Sans:400,400i,700,700i","Noto+Serif:400,400i,700,700i&subset=devanagari","Keania+One"],"moment":{"allowEmpty":true,"includeTimezone":"all","includeLocales":true,"localeOutputPath":"/moment-locales"},"pageTitle":{"prepend":false,"replace":false,"separator":" > "},"resizeServiceDefaults":{"debounceTimeout":100,"heightSensitive":true,"widthSensitive":true,"injectionFactories":["component"]},"plantworks":{"domain":".plant.works","startYear":2016},"EmberENV":{"FEATURES":{},"EXTEND_PROTOTYPES":{},"_JQUERY_INTEGRATION":true},"APP":{"LOG_ACTIVE_GENERATION":false,"LOG_VIEW_LOOKUPS":false,"rootElement":"#ember-testing","autoboot":false,"name":"webapp-frontend","version":"2.4.3+decd8c8c"},"exportApplicationGlobal":true}
          };
          Object.defineProperty(exports, '__esModule', {value: true});
          return exports;
        
});

require('plantworks/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map

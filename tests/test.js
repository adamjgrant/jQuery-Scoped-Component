describe("Mozart class", function() {
  it("is defined", function() {
    expect(Mozart).to.be.a('object');
    expect(Mozart.init).to.be.a('function');
  });
});

describe("Mozart 1st Class Instance Variable", function() {
  var _$_outside_event,
      _$_router_outside_event;

  m$.test_component_without_api     = {};
  m$.test_component_without_router  = {};
  m$.test_component_with_everything = {};
  m$.test_component_for_extending_without_bare_initialization   = {};

  m$.test_component_without_api.events = function(_$) {
    _$("p").click(function() { return "foo"; });
    _$_outside_event = _$;
    _$_router_outside_event = _$.router;
    _$_api_outside_event = _$.api;
  };

  m$.test_component_with_everything.events = function(_$) {
    $("p").click(function() { return "foo" })
  };

  m$.test_component_with_everything.config = {
    api: {
      show: function(_$, options) {
        $.get(_$.router.show(options));
      }
    },
    router: {
      base_url: "/custom_base/",
      name: "custom_name",
      routes: {
        show: {
          url: "#{base_url}#{name}/#{id}.json",
          method: "GET"
        }
      }
    }
  }

  m$.test_component_for_extending_without_bare_initialization.config = {
    api: {
      custom: function(_$, options) {
        $.ajax(_$.router.show(options))
      }
    },
    router: {
      base_url: "custom",
      routes: {
        custom: {
          url: "custom",
          method: "GET"
        }
      }
    }
  }

  Mozart.init([
    "test-component-without-router",
    "test-component-without-api",
    "test_component_with_everything",
    {"test_component_for_extending_without_bare_initialization" : "extended1"},
    {"test_component_for_extending_without_bare_initialization" : "extended2"}
  ]);

  it("defines a scoped jQuery (_$)", function() {
    expect(_$_outside_event).to.be.a('function');
  });

  it("sees a component variables", function() {
    expect(m$.test_component_without_api).to.be.a('object');
    expect(m$.test_component_without_router).to.be.a('object');
  });

  it("defines a router if one is not present", function() {
    expect(_$_router_outside_event).to.be.a('object');
  });

  it("defines an api if one is not present", function() {
    expect(_$_api_outside_event).to.be.a('object')
  });

  it("sets a router object with default functions for interpolating", function() {
    expect(m$.test_component_with_everything.router.index).to.be.a('function');
    expect(m$.test_component_with_everything.router.show).to.be.a('function');
  });

  it("sets an api object with default functions for executing AJAX", function() {
    expect(m$.test_component_with_everything.api.index).to.be.a('function');
    expect(m$.test_component_with_everything.api.show).to.be.a('function');
  });
});

describe("2nd class Mozart instance variable", function() {
  it("creates a 2nd class component variable", function() {
    expect(m$.test_component_for_extending_without_bare_initialization).to.be.a('object');
    expect(m$.extended1).to.be.a('object');
    expect(m$.extended2).to.be.a('object');
  });

  it("inherits configuration from the 1st class component", function() {
    expect(m$.extended1.config.api.custom).to.be.a('function');
    expect(m$.extended1.config.router.base_url).to.equal('custom');
    expect(m$.extended2.config.router.routes.custom).to.be.a('object');
  });

  it("allows 1st class variable to initialize first, even if not initialized bare", function() {
    expect(m$.test_component_for_extending_without_bare_initialization.config.api.index).to.be.a('function');
  });
});

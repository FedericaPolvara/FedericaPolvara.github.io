

$(document).delegate('#Draw', 'pageinit', function() {

	var __slice = Array.prototype.slice;
	(function($) {
	  var Sketch;
	  $.fn.sketch = function() {
	    var args, key, sketch;
	    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    if (this.length > 1) {
	      $.error('Sketch.js can only be called on one element at a time.');
	    }
	    sketch = this.data('sketch');
	    if (typeof key === 'string' && sketch) {
	      if (sketch[key]) {
	        if (typeof sketch[key] === 'function') {
	          return sketch[key].apply(sketch, args);
	        } else if (args.length === 0) {
	          return sketch[key];
	        } else if (args.length === 1) {
	          return sketch[key] = args[0];
	        }
	      } else {
	        return $.error('Sketch.js did not recognize the given command.');
	      }
	    } else if (sketch) {
	      return sketch;
	    } else {
	      this.data('sketch', new Sketch(this.get(0), key));
	      return this;
	    }
	  };
	  Sketch = (function() {
	    function Sketch(el, opts) {
	      this.el = el;
	      this.canvas = $(el);
	      this.context = el.getContext('2d');
	      this.options = $.extend({
	        toolLinks: true,
	        defaultTool: 'marker',
	        defaultColor: '#000000',
	        defaultSize: 5
	      }, opts);
	      this.painting = false;
	      this.color = this.options.defaultColor;
	      this.size = this.options.defaultSize;
	      this.tool = this.options.defaultTool;
	      this.actions = [];
	      this.action = [];
	      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
	      if (this.options.toolLinks) {
	        $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
	          var $canvas, $this, key, sketch, _i, _len, _ref;
	          $this = $(this);
	          $canvas = $($this.attr('href'));
	          sketch = $canvas.data('sketch');
	          _ref = ['color', 'size', 'tool'];
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            key = _ref[_i];
	            if ($this.attr("data-" + key)) {
	              sketch.set(key, $(this).attr("data-" + key));
	            }
	          }
	          if ($(this).attr('data-download')) {
	            sketch.download($(this).attr('data-download'));
	          }
	          return false;
	        });
	      }
	    }
	    Sketch.prototype.download = function(format) {
	      var mime;
	      format || (format = "png");
	      if (format === "jpg") {
	        format = "jpeg";
	      }
	      mime = "image/" + format;
	      return window.open(this.el.toDataURL(mime));
	    };
	    Sketch.prototype.set = function(key, value) {
	      this[key] = value;
	      return this.canvas.trigger("sketch.change" + key, value);
	    };
	    Sketch.prototype.startPainting = function() {
	      this.painting = true;
	      return this.action = {
	        tool: this.tool,
	        color: this.color,
	        size: parseFloat(this.size),
	        events: []
	      };
	    };
	    Sketch.prototype.stopPainting = function() {
	      if (this.action) {
	        this.actions.push(this.action);
	      }
	      this.painting = false;
	      this.action = null;
	      return this.redraw();
	    };
	    Sketch.prototype.onEvent = function(e) {
	      if (e.originalEvent && e.originalEvent.targetTouches) {
	        e.pageX = e.originalEvent.targetTouches[0].pageX;
	        e.pageY = e.originalEvent.targetTouches[0].pageY;
	      }
	      $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
	      e.preventDefault();
	      return false;
	    };
	    Sketch.prototype.redraw = function() {
	      var sketch;
	      this.el.width = this.canvas.width();
	      this.context = this.el.getContext('2d');
	      sketch = this;
	      $.each(this.actions, function() {
	        if (this.tool) {
	          return $.sketch.tools[this.tool].draw.call(sketch, this);
	        }
	      });
	      if (this.painting && this.action) {
	        return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
	      }
	    };
	    return Sketch;
	  })();
	  $.sketch = {
	    tools: {}
	  };
	  $.sketch.tools.marker = {
	    onEvent: function(e) {
	      switch (e.type) {
	        case 'mousedown':
	        case 'touchstart':
	          this.startPainting();
	          break;
	        case 'mouseup':
	        case 'mouseout':
	        case 'mouseleave':
	        case 'touchend':
	        case 'touchcancel':
	          this.stopPainting();
	      }
	      if (this.painting) {
	        this.action.events.push({
	          x: e.pageX - this.canvas.offset().left,
	          y: e.pageY - this.canvas.offset().top,
	          event: e.type
	        });
	        return this.redraw();
	      }
	    },
	    draw: function(action) {
	      var event, previous, _i, _len, _ref;
	      this.context.lineJoin = "round";
	      this.context.lineCap = "round";
	      this.context.beginPath();
	      this.context.moveTo(action.events[0].x, action.events[0].y);
	      _ref = action.events;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        event = _ref[_i];
	        this.context.lineTo(event.x, event.y);
	        previous = event;
	      }
	      this.context.strokeStyle = action.color;
	      this.context.lineWidth = action.size;
	      return this.context.stroke();
	    }
	  };
	  return $.sketch.tools.eraser = {
	    onEvent: function(e) {
	      return $.sketch.tools.marker.onEvent.call(this, e);
	    },
	    draw: function(action) {
	      var oldcomposite;
	      oldcomposite = this.context.globalCompositeOperation;
	      this.context.globalCompositeOperation = "copy";
	      action.color = "rgba(0,0,0,0)";
	      $.sketch.tools.marker.draw.call(this, action);
	      return this.context.globalCompositeOperation = oldcomposite;
	    }
	  };
	})(jQuery);


	$(document).ready(function(){


		$(document).ready(function(){
		$('a[href^="#"]').on('click',function (e) {
		    e.preventDefault();

		    var target = this.hash;
		    var $target = $(target);

		    $('html, body').stop().animate({
		        'scrollTop': $target.offset().top
		    }, 900, 'swing', function () {
		        window.location.hash = target;
		    });
		});
	});

	    //mobile menu toggling
	    $("#menu_icon").click(function(){
	        $("header nav ul").toggleClass("show_menu");
	        $("#menu_icon").toggleClass("close_menu");
	        return false;
	    });



	    //Contact Page Map Centering
	    var hw = $('header').width() + 50;
	    var mw = $('#map').width();
	    var wh = $(window).height();
	    var ww = $(window).width();

	    $('#map').css({
	        "max-width" : mw,
	        "height" : wh
	    });

	    if(ww>1100){
	         $('#map').css({
	            "margin-left" : hw
	        });
	    }





	    //Tooltip
	    $("a").mouseover(function(){

	        var attr_title = $(this).attr("data-title");

	        if( attr_title == undefined || attr_title == "") return false;

	        $(this).after('<span class="tooltip"></span>');

	        var tooltip = $(".tooltip");
	        tooltip.append($(this).data('title'));


	        var tipwidth = tooltip.outerWidth();
	        var a_width = $(this).width();
	        var a_hegiht = $(this).height() + 3 + 4;

	        //if the tooltip width is smaller than the a/link/parent width
	        if(tipwidth < a_width){
	            tipwidth = a_width;
	            $('.tooltip').outerWidth(tipwidth);
	        }

	        var tipwidth = '-' + (tipwidth - a_width)/2;
	        $('.tooltip').css({
	            'left' : tipwidth + 'px',
	            'bottom' : a_hegiht + 'px'
	        }).stop().animate({
	            opacity : 1
	        }, 200);


	    });

	    $("a").mouseout(function(){
	        var tooltip = $(".tooltip");
	        tooltip.remove();
	    });


	});

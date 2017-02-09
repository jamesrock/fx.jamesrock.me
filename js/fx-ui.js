(function() {
	
	rates.sort(ROCK.SORT.STRING.ASCENDING(function() {
		return this.name;
	}));

	rates.onload = function(rate, count) {
		loader.html(rate.id + " rate fetched (<span class=\"number\">" + count + "</span> of <span class=\"number\">" + rates.length + "</span>).");
		if(count===rates.length) {
			loader.html("All rates fetched (<span class=\"number\">" + count + "</span> of <span class=\"number\">" + rates.length + "</span>).");
		};
		if(rate.multiplier===0) {
			console.log(rate.id + " is 0");
		};
	};

	var 
	app = $("[data-role=\"app\"]"),
	setOutput = function() {
		output.val(rates.getRate(input.val(), fromSelect.val(), toSelect.val()));
	},
	fromAndToSelectWrap = ROCK.JQUERY.createNode("div").appendTo(app),
	fromSelect = rates.toSelect().appendTo(fromAndToSelectWrap).on("change", function() {
		setOutput();
	}).val(rates.baseRate),
	toSelect = rates.toSelect().appendTo(fromAndToSelectWrap).on("change", function() {
		setOutput();
	}).val(rates.baseRate),
	inputOutputWrap = ROCK.JQUERY.createNode("div").appendTo(app),
	input = ROCK.JQUERY.createNode("input").attr("type", "text").val("100.00").appendTo(inputOutputWrap).on("keyup", function() {
		setOutput();
	}),
	output = ROCK.JQUERY.createNode("input").attr("type", "text").attr("readonly", "readonly").appendTo(inputOutputWrap),
	loader = ROCK.JQUERY.createNode("div").attr("data-app-role", "loader").appendTo(app).html("Loading...");

	input.trigger("keyup");

	rates.getRates();
	
})();
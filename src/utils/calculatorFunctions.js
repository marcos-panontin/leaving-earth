
var payload = [];
var rockets = [];
var unchangedManuever = {};
var manuever = {};

var settings = {
	IncludeOuterPlanets: false,
	IncludeStations: false
};

/* MW - change - new var to identify shuttles */
var shuttles = [
	{ Quantity: "1", Name: "Daedalus", Sort: "a", Tank: "Fuel Tank (small)", Expansion: "Stations" },	
	{ Quantity: "1", Name: "Shuttle", Sort: "b", Tank: "Fuel Tank (large)", Expansion: "Stations" }
];

/*
 Localstorage-items:

 'payloadCopy' : Copy of craft payload in clipboard
 'rocketsCopy' : Copy of craft rockets in clipboard
 'lastPayload' : Always the latest payload
 'lastRockets' : Always the latest rockets
 'lastUnchangedManuever' : Always latest manuever
 'lastManuever': Always latest manuever
 'settings': The settings variable (currently the only settings available are "Include Stations" and "Include Outer Planets")
*/



$(document).ready(function () {

	$('body').disableSelection();

	$('#cb-outer-planets').click(function () {
		settings.IncludeOuterPlanets = $(this).is(":checked");
		localStorage.setItem("settings", JSON.stringify(settings));
	});
	$('#cb-stations').click(function () {
		settings.IncludeStations = $(this).is(":checked");
		localStorage.setItem("settings", JSON.stringify(settings));
	});

	InitPage();

});


// --------------------------------
// InitPage
// --------------------------------
function InitPage() {

	$('body').removeClass('body-without-nav-bar');

	// -------------------------------------------------------------
	// From localStorage
	// -------------------------------------------------------------
	var temp;
	temp = localStorage.getItem("settings");
	if (temp != null) {
		settings = JSON.parse(temp);
	}		
	temp = localStorage.getItem("lastUnchangedManuever");
	unchangedManuever = CloneManuever(temp == null ? manuevers[0] : JSON.parse(temp));
	temp = localStorage.getItem("lastManuever");
	manuever = CloneManuever(temp == null ? manuevers[0] : JSON.parse(temp));
	temp = localStorage.getItem("lastPayload");
	var tempPayload = (temp == null ? [] : JSON.parse(temp));
	temp = localStorage.getItem("lastRockets");
	var tempRockets = (temp == null ? [] : JSON.parse(temp));
	PasteCraft(tempPayload, tempRockets);

	// --------------------------------
	// Click events
	// --------------------------------
	$('#button-location').click(function () {

		if (manuever.Name.startsWith("Custom")) {
			manuever = CloneManuever(unchangedManuever);
			localStorage.setItem("lastManuever", JSON.stringify(manuever));
			UpdateAllValues();
		}
		else {
			CreateManueversDialog();
			$("#dialog-manuevers").dialog("open");
		}
	});
	$('#button-less-diff').click(function () {
		if (manuever.Difficulty > 0) {
			manuever.Name = "Custom manuever";
			manuever.Difficulty = Number(manuever.Difficulty - 1);
			localStorage.setItem("lastManuever", JSON.stringify(manuever));
			UpdateAllValues();
		}
	});
	$('#button-more-diff').click(function () {
		manuever.Name = "Custom manuever";
		manuever.Difficulty = Number(manuever.Difficulty + 1);
		localStorage.setItem("lastManuever", JSON.stringify(manuever));
		UpdateAllValues();
	});
	$('#button-faster').click(function () {
		if (manuever.Hourglasses > 0) {
			manuever.Name = "Custom manuever";
			manuever.Hourglasses = Number(manuever.Hourglasses - 1);
			localStorage.setItem("lastManuever", JSON.stringify(manuever));
			UpdateAllValues();
		}
	});
	$('#button-slower').click(function () {
		manuever.Name = "Custom manuever";
		manuever.Hourglasses = Number(manuever.Hourglasses + 1);
		localStorage.setItem("lastManuever", JSON.stringify(manuever));
		UpdateAllValues();
	});
	$('#button-rockets').click(function () {
		CreateComponentsDialog('rocket', rockets, '#rockets-container');
		$("#dialog-components").dialog("open");
	});
	$('#button-payload').click(function () {
		CreateComponentsDialog('', null, '');
		$("#dialog-components").dialog("open");
	});
	$('#button-clear-spacecraft').click(function () {
		ClearCraft();
	});
	$('#button-copy-spacecraft').click(function () {
		localStorage.setItem("payloadCopy", JSON.stringify(payload));
		localStorage.setItem("rocketsCopy", JSON.stringify(rockets));
	});
	$('#button-paste-spacecraft').click(function () {
		var tempPayload = JSON.parse(localStorage.getItem("payloadCopy"));
		var tempRockets = JSON.parse(localStorage.getItem("rocketsCopy"));
		PasteCraft(tempPayload, tempRockets);
	});
	$('#button-options').click(function () {
		CreateOptionsDialog();
		$("#dialog-options").dialog("open");
	});

	UpdateAllValues();

	// ------------------------------------------------------------
	// Dialogs
	// ------------------------------------------------------------
	InitDialogComponents();
	InitDialogManuevers();
	InitDialogManuevers2();
	InitDialogOptions();
}

// --------------------------------
// UpdateAllValues
// --------------------------------
function UpdateAllValues() {
    //MW - add call to new function
    CheckForShuttle();
    
  	if (manuever.Name.startsWith("Custom")) {
		var html = '<table>';
		html += '<tr><td id="location-name">Custom manuever</td></tr>';
		html += '</table>';
		$('#location-manuever-name').html(html);
	}
	else {
		var htmlString = GetManueverHtmlString(manuever, '60%');
		var html = '<table>';

		var color = "";
		if (manuever.Slingshot == "jupiter")
			color = "color: rgb(192, 109, 98);";
		if (manuever.Slingshot == "uranus")
			color = "color: rgb(160, 237, 216);";
		if (manuever.Slingshot == "saturn")
			color = "color: rgb(232, 190, 135);";
		if (manuever.Slingshot == "neptune")
			color = "color: rgb(160, 216, 237);";

		html += '<tr><td class="location-name" style="' + color + '">' + manuever.Name + '</td></tr>';
		html += '<tr><td><div class="location-manuever">' + htmlString + '</div></td></tr>';
		html += '</table>';
		$('#location-manuever-name').html(html);
	}

	var payloadMass = CalculatePayloadMass(payload);
	var thrustNeeded = CalculateThrustNeeded(payload, rockets, manuever);
	var thrustProvided = CalculateThrustProvided(payload, rockets, manuever);
	var maxPayload = CalculateMaxPayload(payload, rockets, manuever);
	if (thrustNeeded > 0) {
		$('#thrust-needed').html('↑ needed:</br>' + thrustNeeded);
	}
	else {
		$('#thrust-needed').html('&nbsp;');
	}
	if (thrustProvided > 0) {
		$('#thrust-provided').html('↑ provided:<br/>' + thrustProvided);
	}
	else {
		$('#thrust-provided').html('&nbsp;');
	}

	if (thrustProvided >= thrustNeeded) {
		$('#thrust-needed').css('color', 'rgb(50, 200, 50)');
		$('#thrust-provided').css('color', 'rgb(50, 200, 50)');
	}
	else {
		$('#thrust-needed').css('color', 'rgb(238, 238, 238)');
		$('#thrust-provided').css('color', 'rgb(238, 238, 238)');
	}

	$('#button-payload').text('Payload');
	if (payloadMass > 0)
		$('#button-payload').text('Payload (' + payloadMass + ')');

	$("#diff").text(manuever.Difficulty);

	if (thrustProvided <= 0)
		$('#max-payload-container').hide();
	else {
		$('#max-payload-container').show();
		$('#max-payload').text('Max payload: ' + maxPayload);
		if ((maxPayload > 0 && maxPayload >= payloadMass) || maxPayload == "inf.") {
			$('#max-payload').css('color', 'rgb(50, 200, 50)');
		}
		else {
			$('#max-payload').css('color', 'rgb(238, 238, 238)');
		}
	}

	var hourglasses = '';
	if (manuever.Hourglasses > 3) {
		hourglasses += '<img class="hourglass" src="images/hourglass.png" />';
		hourglasses += ' x' + manuever.Hourglasses;
	}
	else {
		for (var i = 0; i < manuever.Hourglasses; i++)
			hourglasses += '<img class="hourglass" src="images/hourglass.png" />';
	}
	$("#hourglasses").html('');
	$("#hourglasses").html(hourglasses);

	if (payload.length == 0 && rockets.length == 0) {
		$('#button-clear-spacecraft').hide();
		$(".footer table td").css("width", "33%");
	}
	else {
		$('#button-clear-spacecraft').show();
		$(".footer table td").css("width", "25%");
	}
}

// --------------------------------
// PasteCraft
// --------------------------------
function PasteCraft(fromPayload, fromRockets) {
	ClearCraft();

	for (var i = 0; i < fromPayload.length; i++) {
		AddComponentToSpacecraft(payload, fromPayload[i]);
	}
	for (var i = 0; i < fromRockets.length; i++) {
		AddComponentToSpacecraft(rockets, fromRockets[i]);
	}
	CreateSpacecraftDivs(payload, "#payload-container");
	CreateSpacecraftDivs(rockets, "#rockets-container");
	UpdateAllValues();
}

// --------------------------------
// CalculateMaxPayload
// --------------------------------
function CalculateMaxPayload(payl, rock, man) {

	var maxPayload = 0;

	var rocketMass = CalculateRocketsMass(rock);
	var thrustProvided = CalculateThrustProvided(payl, rock, man);

	if (thrustProvided > 0) {
		if (man.Difficulty != 0)
			maxPayload = Math.round(((thrustProvided / man.Difficulty) - rocketMass) * 100) / 100;
		else
			maxPayload = 'inf.';
	}

	if (maxPayload < 0)
		maxPayload = 0;

	return maxPayload;
}

// --------------------------------
// CalculatePayloadMass
// --------------------------------
function CalculatePayloadMass(payl) {
	var mass = 0;
	for (var i = 0; i < payl.length; i++) {
		mass += Number(payl[i].Mass) * Number(payl[i].Quantity);
	}
	return mass;
}

// --------------------------------
// CalculateRocketsMass
// --------------------------------
function CalculateRocketsMass(rock) {
	var mass = 0;
	for (var i = 0; i < rock.length; i++) {
		mass += Number(rock[i].Mass) * Number(rock[i].Quantity);
	}
	return mass;
}

// --------------------------------
// CalculateMass
// --------------------------------
function CalculateMass(payl, rock) {
	var mass = 0;
	for (var i = 0; i < payl.length; i++) {
		mass += Number(payl[i].Mass) * Number(payl[i].Quantity);
	}
	for (var i = 0; i < rock.length; i++) {
		mass += Number(rock[i].Mass) * Number(rock[i].Quantity);
	}
	return mass;
}

// --------------------------------
// CalculateThrustNeeded
// --------------------------------
function CalculateThrustNeeded(payl, rock, man) {
	var mass = CalculateMass(payl, rock);
	var thrustNeeded = Number(mass) * Number(man.Difficulty);
	return thrustNeeded;
}

// --------------------------------
// CalculateThrustProvided
// --------------------------------
function CalculateThrustProvided(payl, rock, man) {
	var thrust = 0;
    /* MW - Change #1 - comment out payload for-loop  */
	/* for (var i = 0; i < payl.length; i++) {
		if (payl[i].Name == 'Ion')
			thrust += Number(payl[i].Thrust) * Number(payl[i].Quantity) * Number(man.Hourglasses);
	} */
	for (var i = 0; i < rock.length; i++) {
		if (rock[i].Name == 'Ion') {
			thrust += Number(rock[i].Thrust) * Number(rock[i].Quantity) * Number(man.Hourglasses);
        }
		else
			thrust += Number(rock[i].Thrust) * Number(rock[i].Quantity);
        }
	return thrust;
}

// --------------------------------
// AddComponentToSpacecraft
// --------------------------------
function AddComponentToSpacecraft(spacecraftComponentsArray, component) {
	if (component == null) {
		alert('AddComponentToSpacecraft(): Component is null');
		return;
	}

	// 1) If the component already exists in the component list, we increase quantity instead of adding it
	var componentAlreadyInList = FindComponent(spacecraftComponentsArray, component.Name);
	if (componentAlreadyInList == null) {
		var clone = {
			Quantity: Number(component.Quantity),
			Name: component.Name,
			Sort: component.Sort,
			Type: component.Type,
			"Class": component.Class,
			Mass: component.Mass,
			Thrust: component.Thrust,
			Cost: component.Cost,
			Seats: component.Seats,
			Expansion: component.Expansion
		};
		spacecraftComponentsArray.push(clone);
	}
	else {
		componentAlreadyInList.Quantity = Number(componentAlreadyInList.Quantity) + Number(component.Quantity);
	}

	// 2) Sort the list on a property "Sort"
	spacecraftComponentsArray.sort(dynamicSort("Sort"));

	UpdateAllValues();
}

// --------------------------------
// FindComponent
// --------------------------------
function FindComponent(componentArray, name) {
	for (var i = 0; i < componentArray.length; i++) {
		if (componentArray[i].Name == name) {
			//var clone = {
			//    Quantity: "1",
			//    Name: componentArray[i].Name,
			//    Sort: componentArray[i].Sort,
			//    Type: componentArray[i].Type,
			//    "Class": componentArray[i].Class,
			//    Mass: componentArray[i].Mass,
			//    Thrust: componentArray[i].Thrust,
			//    Cost: componentArray[i].Cost,
			//    Seats: componentArray[i].Seats,
			//    Expansion: com...
			//};
			//return clone;
			return componentArray[i];
		}
	}
	return null;
}

// --------------------------------
// DeleteComponent
// --------------------------------
function DeleteComponent(componentArray, name, containerId) {
	for (var i = 0; i < componentArray.length; i++) {
		if (componentArray[i].Name === name) {
			componentArray.splice(i, 1);
			break;
		}
	}
	UpdateAllValues();

	$(containerId).html('');
	CreateSpacecraftDivs(componentArray, containerId);
}

// --------------------------------
// CreateSpacecraftDivs
// --------------------------------
function CreateSpacecraftDivs(componentsArray, containerId) {
	$(containerId).html('');
	for (var i = 0; i < componentsArray.length; i++) {
		var divContainer = $('<div>', {
			"class": "component-container",
			"data-component-name": componentsArray[i].Name,
			"data-container-id": containerId
		});

		var buttonDecQuantity = $('<button>', {
			"class": "button-dec-qty",
			"text": "-",
			"data-component-name": componentsArray[i].Name,
			"data-container-id": containerId,
			click: function () {
				var component;
				component = FindComponent(componentsArray, $(this).attr("data-component-name"));
				component.Quantity = (Number(component.Quantity) - 1);
				UpdateQuantityDiv(componentsArray, containerId, component.Name, component.Quantity);
				localStorage.setItem("lastPayload", JSON.stringify(payload));
				localStorage.setItem("lastRockets", JSON.stringify(rockets));
				UpdateAllValues();
			}
		});

		var buttonIncQuantity = $('<button>', {
			"class": "button-inc-qty",
			"text": "+",
			"data-component-name": componentsArray[i].Name,
			"data-container-id": containerId,
			click: function () {
				var component;
				component = FindComponent(componentsArray, $(this).attr("data-component-name"));
				component.Quantity = (Number(component.Quantity) + 1);
				UpdateQuantityDiv(componentsArray, containerId, component.Name, component.Quantity);
				localStorage.setItem("lastPayload", JSON.stringify(payload));
				localStorage.setItem("lastRockets", JSON.stringify(rockets));
				UpdateAllValues();
			}
		});

		var divQuantity = $('<div>', {
			"class": "quantity",
			"data-component-name": componentsArray[i].Name,
			text: componentsArray[i].Quantity
		});

		
		var htmlString = '';
		htmlString = '<table><tr>';
		htmlString += '<td class="name">' + componentsArray[i].Name + '</td>';
		htmlString += '<td class="data"><img class="icon" src="images/mass.png" />&nbsp;' + componentsArray[i].Mass;
		if (componentsArray[i].Thrust != '0') {
			htmlString += '&nbsp;&nbsp;<img class="icon" src="images/thrust.png" />&nbsp;' + componentsArray[i].Thrust + '</td>';
		}

		htmlString += '</tr></table>';

		var divComponent = $("<div>", {
			"class": "component " + componentsArray[i].Class,
			"data-component-name": componentsArray[i].Name,
			"data-component-type": componentsArray[i].Type,
			"data-component-thrust": componentsArray[i].Thrust,
			"data-container-id": containerId,
			html: htmlString,
			click: function () {
				var component;
				if ($(this).attr('data-container-id') == "#rockets-container") {
					// Move to payload                    
					component = FindComponent(rockets, $(this).attr('data-component-name'));
					DeleteComponent(rockets, component.Name, "#rockets-container");
					AddComponentToSpacecraft(payload, component);
					CreateSpacecraftDivs(payload, "#payload-container");
					UpdateAllValues();
				}
				if ($(this).attr('data-container-id') == "#payload-container" && $(this).attr('data-component-thrust') != '0') {
					// Move to rockets
					component = FindComponent(payload, $(this).attr('data-component-name'));
					DeleteComponent(payload, component.Name, "#payload-container");
					AddComponentToSpacecraft(rockets, component);
					CreateSpacecraftDivs(rockets, "#rockets-container");
					UpdateAllValues();
				}
			}
		});

		divContainer.append(buttonDecQuantity);
		divContainer.append(divQuantity);
		divContainer.append(buttonIncQuantity);
		divContainer.append(divComponent);
		$(containerId).append(divContainer);

		if (componentsArray[i].Quantity == 0) {
			$('.component-container[data-container-id="' + containerId + '"][data-component-name="' + componentsArray[i].Name + '"]').css('opacity', '0.4');
		}
		else {
			$('.component-container[data-container-id="' + containerId + '"][data-component-name="' + componentsArray[i].Name + '"]').css('opacity', '1');
		}
        
        /* MW - make +/- buttons invisible for Fuel Tanks  */
        if (containerId == "#payload-container") {
            CheckMinus(buttonDecQuantity, componentsArray[i]);
        }
        
	}

	localStorage.setItem("lastPayload", JSON.stringify(payload));
	localStorage.setItem("lastRockets", JSON.stringify(rockets));
}

// --------------------------------
// CreateComponentsDialog
// typeAllowed = ''         First dialog, show main groups
// --------------------------------
function CreateComponentsDialog(typeAllowed, addToArray, addToContainer) {
	$('#dialog-components').html('');

	if (typeAllowed == '') {

		// Probes
		var divContainer = $('<div>', { "class": "component-container" });
		var divComponent = $("<div>", {
			"class": "component gray",
			"data-component-name": 'probe',
			html: '<div class="name">Probes</div>',
			click: function () {
				$("#dialog-components").dialog('close');
				CreateComponentsDialog('probe', payload, '#payload-container');
				$("#dialog-components").dialog("open");
			}
		});
		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);

		// Capsules
		divContainer = $('<div>', { "class": "component-container" });
		divComponent = $("<div>", {
			"class": "component gray",
			"data-component-name": 'capsule',
			html: '<div class="name">Capsules</div>',
			click: function () {
				$("#dialog-components").dialog('close');
				CreateComponentsDialog('capsule', payload, '#payload-container');
				$("#dialog-components").dialog("open");
			}
		});
		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);

		// Rockets
		divContainer = $('<div>', { "class": "component-container" });
		divComponent = $("<div>", {
			"class": "component gray",
			"data-component-name": 'rocket',
			html: '<div class="name">Rockets</div>',
			click: function () {
				$("#dialog-components").dialog('close');
				CreateComponentsDialog('rocket', payload, '#payload-container');
				$("#dialog-components").dialog("open");
			}
		});
		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);

		if (settings.IncludeStations) {
			// Fuel and Modules (Stations)
			divContainer = $('<div>', { "class": "component-container" });
			divComponent = $("<div>", {
				"class": "component gray",
				"data-component-name": 'module',
				html: '<div class="name">Fuel / Modules</div>',
				click: function () {
					$("#dialog-components").dialog('close');
					CreateComponentsDialog('module', payload, '#payload-container');
					$("#dialog-components").dialog("open");
				}
			});
			divContainer.append(divComponent);
			$('#dialog-components').append(divContainer);
		}
		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);

		// Supplies, Other
		divContainer = $('<div>', { "class": "component-container" });
		divComponent = $("<div>", {
			"class": "component gray",
			"data-component-name": 'other',
			html: '<div class="name">Supplies / Other</div>',
			click: function () {
				$("#dialog-components").dialog('close');
				CreateComponentsDialog('other', payload, '#payload-container');
				$("#dialog-components").dialog("open");
			}
		});
		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);

		return;
	}

	for (var i = 0; i < components.length; i++) {
		if (typeAllowed != components[i].Type)
			continue;

		if (components[i].Expansion == "Outer Planets" && !settings.IncludeOuterPlanets)
			continue;

		if (components[i].Expansion == "Stations" && !settings.IncludeStations)
			continue;

		// Supplies från base game tas bort om man kör med Stations
		if (components[i].Name == "Supplies" && components[i].Expansion == "" && settings.IncludeStations)
			continue;

		var htmlString = '';
		htmlString = '<table><tr>';
		htmlString += '<td class="name">' + components[i].Name + '</td>';
		htmlString += '<td class="data"><img class="icon" src="images/mass.png" />&nbsp;' + components[i].Mass;
		if (components[i].Thrust != '0') {
			htmlString += '&nbsp;&nbsp;<img class="icon" src="images/thrust.png" />&nbsp;' + components[i].Thrust + '</td>';
		}
		htmlString += '</tr></table>';

		divContainer = $('<div>', {
			"class": "component-container"
		});

		divComponent = $("<div>", {
			"class": "component " + components[i].Class,
			"data-component-name": components[i].Name,
			html: htmlString,
			click: function () {
				var component = FindComponent(components, $(this).attr('data-component-name'));
				AddComponentToSpacecraft(addToArray, component);
				CreateSpacecraftDivs(addToArray, addToContainer);
				$("#dialog-components").dialog('close');
			}
		});

		divContainer.append(divComponent);
		$('#dialog-components').append(divContainer);
	}
}

function CreateOptionsDialog() {
	// Outer planets checked?
	$('#cb-outer-planets').prop('checked', settings.IncludeOuterPlanets);

	// Stations checked?
	$('#cb-stations').prop('checked', settings.IncludeStations);

}

function FindManuever(fromLoc, toLoc, aerobraking) {
	for (var i = 0; i < manuevers.length; i++) {
		if (manuevers[i].From == fromLoc && manuevers[i].To == toLoc && (aerobraking == null || (aerobraking == true && manuevers[i].Aerobraking)))
			return manuevers[i];
	}
	return null;
}

function GetLocationCard(name, text, bgclass) {
	var td = $('<td>', {
		'class': bgclass,
		'html': text,
		click: function (e) {
			$("#dialog-manuevers").dialog("close");
			CreateManueversDialog2(name);
			$("#dialog-manuevers-2").dialog("open");
		}
	});

	return td;
}

function GetEmptyLocationCard() {
	var td = $('<td>', {
		'html': '&nbsp;',
		click: function () {
			$("#dialog-manuevers").dialog('close');
		}
	});

	return td;
}

function GetEmptyLocationCard2() {
	var td = $('<td>', {
		'html': '&nbsp;',
		click: function (e) {
			$("#dialog-manuevers-2").dialog('close');
			$("#dialog-manuevers").dialog('open');
		}
	});

	return td;
}

function GetLocationCard2(toLocName, toLoctext, fromLocName, bgclass, clickable, aerobraking) {
	var td = "";

	var man = FindManuever(fromLocName, toLocName, aerobraking);

	if (clickable && man != null) {
		td = $('<td>', {
			'class': bgclass,
			'html': toLoctext,
			"data-manuever-to": man.To,
			"data-manuever-from": man.From,
			"data-difficulty": man.Difficulty,
			"data-exclamation": man.Exclamation,
			"data-aerobraking": man.Aerobraking,
			"data-slingshot": man.Slingshot,
			"data-hourglasses": man.Hourglasses,
			"data-optional-hourglass": man.OptionalHourglass,
			"data-solar-radiation": man.SolarRadiation,
			"data-reentry": man.Reentry,
			"data-landing": man.Landing,
			"data-optional-landing": man.OptionalLanding,
			"data-background-class": man.BackgroundClass,
			click: function (e) {
				var newManuever = {
					Name: $(this).attr('data-manuever-from') + " to " + $(this).attr('data-manuever-to'),
					From: $(this).attr('data-manuever-from'),
					To: $(this).attr('data-manuever-to'),
					Difficulty: Number($(this).attr('data-difficulty')),
					Aerobraking: $(this).attr('data-aerobraking') == "true",
					Exclamation: $(this).attr('data-exclamation') == "true",
					Slingshot: $(this).attr('data-slingshot'),
					Hourglasses: Number($(this).attr('data-hourglasses')),
					OptionalHourglass: $(this).attr('data-optional-hourglass') == "true",
					SolarRadiation: $(this).attr('data-solar-radiation') == "true",
					Reentry: $(this).attr('data-reentry') == "true",
					Landing: $(this).attr('data-landing') == "true",
					OptionalLanding: $(this).attr('data-optional-landing') == "true",
					BackgroundClass: $(this).attr('data-background-class')
				}

				unchangedManuever = CloneManuever(newManuever);
				manuever = CloneManuever(newManuever);
				localStorage.setItem("lastManuever", JSON.stringify(manuever));
				localStorage.setItem("lastUnchangedManuever", JSON.stringify(unchangedManuever));
				UpdateAllValues();
				
				$("#dialog-manuevers").dialog('close');
				$("#dialog-manuevers-2").dialog('close');
			}
		});
	}
	else {
		td = $('<td>', {
			// 'class': bgclass,
			'style': 'border: 0;',
			'html': toLoctext,
			click: function (e) {
				$("#dialog-manuevers-2").dialog('close');
				$("#dialog-manuevers").dialog('open');

			}
		});

	}

	return td;
}

function GetAerobrakingLocationCard2(fromLocation) {
	var td = GetEmptyLocationCard2();

	if (settings.IncludeOuterPlanets) {
		if (fromLocation == "Mars Fly-By") {
			td = GetLocationCard2("Mars Orbit", "Mars<br/>Orbit", fromLocation, "location-mars-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Venus Fly-By") {
			td = GetLocationCard2("Venus Orbit", "Venus<br/>Orbit", fromLocation, "location-venus-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Outer Plan Trans") {
			td = GetLocationCard2("Mars Orbit", "Mars<br/>Orbit", fromLocation, "location-mars-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Jupiter Fly-By") {
			td = GetLocationCard2("Jupiter Orbit", "Jupiter<br/>Orbit", fromLocation, "location-jupiter-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Saturn Fly-By") {
			td = GetLocationCard2("Saturn Orbit", "Saturn<br/>Orbit", fromLocation, "location-saturn-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Saturn Orbit") {
			td = GetLocationCard2("Titan Orbit", "Titan<br/>Orbit", fromLocation, "location-titan-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
	}

	if (settings.IncludeStations) {
		if (fromLocation == "Mars Cycler") {
			td = GetLocationCard2("Mars Orbit", "Mars<br/>Orbit", fromLocation, "location-mars-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
		if (fromLocation == "Earth Cycler") {
			td = GetLocationCard2("Earth Orbit", "Earth<br/>Orbit", fromLocation, "location-earth-gravity", true, true);
			td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		}
	}

	return td;
}

function CreateManueversDialog() {
	$('#dialog-manuevers').html('');

	var table = $('<table>', {
		'class': 'locations-table'
	});

	var tr = "";

	if (settings.IncludeOuterPlanets) {
		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetEmptyLocationCard());
		tr.append(GetLocationCard('Neptune', 'Neptune', 'location-neptune-gravity'));
		tr.append(GetLocationCard('Neptune Fly-By', 'Neptune<br/>Fly-By', 'location-neptune-gravity'));
		tr.append(GetLocationCard('Uranus Fly-By', 'Uranus<br/>Fly-By', 'location-uranus-gravity'));
		tr.append(GetLocationCard('Uranus', 'Uranus', 'location-uranus-gravity'));
		tr.append(GetLocationCard('Saturn', 'Saturn', 'location-saturn-gravity'));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetLocationCard('Jupiter', 'Jupiter', 'location-jupiter-gravity'));
		tr.append(GetLocationCard('Europa', 'Europa', 'location-europa-gravity'));
		tr.append(GetLocationCard('Callisto', 'Callisto', 'location-callisto-gravity'));
		tr.append(GetEmptyLocationCard());
		tr.append(GetLocationCard('Saturn Orbit', 'Saturn<br/>Orbit', 'location-saturn-gravity'));
		tr.append(GetLocationCard('Enceladus', 'Enceladus', 'location-enceladus-gravity'));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetLocationCard('Io', 'Io', 'location-io-gravity'));
		tr.append(GetLocationCard('Ganymede Orbit', 'Ganymede<br/>Orbit', 'location-ceres-gravity'));
		tr.append(GetLocationCard('Jupiter Orbit', 'Jupiter<br/>Orbit', 'location-jupiter-gravity'));
		tr.append(GetLocationCard('Saturn Fly-By', 'Saturn<br/>Fly-By', 'location-saturn-gravity'));
		tr.append(GetLocationCard('Titan Orbit', 'Titan<br/>Orbit', 'location-titan-gravity'));
		tr.append(GetLocationCard('Titan', 'Titan', 'location-titan-gravity'));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetEmptyLocationCard());
		tr.append(GetLocationCard('Ganymede', 'Ganymede', 'location-ceres-gravity'));
		tr.append(GetLocationCard('Jupiter Fly-By', 'Jupiter<br/>Fly-By', 'location-jupiter-gravity'));
		tr.append(GetLocationCard('Outer Plan Trans', 'Outer', 'location-inner-plan-trans'));
		tr.append(GetEmptyLocationCard());
		tr.append(GetEmptyLocationCard());
		table.append(tr);
	}

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard());
	tr.append(GetLocationCard('Phobos', 'Phobos', 'location-mars-gravity'));
	tr.append(GetLocationCard('Mars Fly-By', 'Mars<br/>Fly-By', 'location-mars-gravity'));
	tr.append(GetLocationCard('Ceres', 'Ceres', 'location-ceres-gravity'));
	tr.append(GetLocationCard('Venus Orbit', 'Venus<br/>Orbit', 'location-venus-gravity'));
	tr.append(GetLocationCard('Venus', 'Venus', 'location-venus-gravity'));
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard());
	tr.append(GetLocationCard('Mars', 'Mars', 'location-mars-gravity'));
	tr.append(GetLocationCard('Mars Orbit', 'Mars<br/>Orbit', 'location-mars-gravity'));
	tr.append(GetLocationCard('Inner Plan Trans', 'Inner', 'location-inner-plan-trans'));
	tr.append(GetLocationCard('Venus Fly-By', 'Venus<br/>Fly-By', 'location-venus-gravity'));
	tr.append(GetEmptyLocationCard());
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetLocationCard('Mercury Fly-By', 'Mercury<br/>Fly-By', 'location-mercury-gravity'));
	tr.append(GetLocationCard('Mercury Orbit', 'Mercury<br/>Orbit', 'location-mercury-gravity'));
	if (settings.IncludeStations) {
		tr.append(GetLocationCard('Mars Cycler', 'Mars<br/>Cycler', 'location-mars-gravity'));
	}
	else {
		tr.append(GetEmptyLocationCard());
	}
	tr.append(GetLocationCard('Earth Orbit', 'Earth<br/>Orbit', 'location-earth-gravity'));
	tr.append(GetLocationCard('Lunar Orbit', 'Lunar<br/>Orbit', 'location-moon-gravity'));
	tr.append(GetLocationCard('Moon', 'Moon', 'location-moon-gravity'));
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard());
	tr.append(GetLocationCard('Mercury', 'Mercury', 'location-mercury-gravity'));
	if (settings.IncludeStations) {
		tr.append(GetLocationCard('Earth Cycler', 'Earth<br/>Cycler', 'location-earth-gravity'));
	}
	else {
		tr.append(GetEmptyLocationCard());
	}
	tr.append(GetLocationCard('Suborbital Space', 'Suborb.<br/>Space', 'location-earth-gravity'));
	tr.append(GetLocationCard('Lunar Fly-By', 'Lunar<br/>Fly-By', 'location-moon-gravity'));
	tr.append(GetEmptyLocationCard());
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard());
	tr.append(GetEmptyLocationCard());
	tr.append(GetEmptyLocationCard());
	tr.append(GetLocationCard('Earth', 'Earth', 'location-earth-gravity'));
	tr.append(GetEmptyLocationCard());
	tr.append(GetEmptyLocationCard());
	table.append(tr);

	$('#dialog-manuevers').append(table);
}

function CreateManueversDialog2(fromLocation) {

	$('#dialog-manuevers-2').dialog('option', 'title', fromLocation + ' to...');
	$('#dialog-manuevers-2').html('');

	var table = $('<table>', {
		'class': 'locations-table'
	});

	var tr;

	if (settings.IncludeOuterPlanets) {
		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetEmptyLocationCard2());
		tr.append(GetLocationCard2('Neptune', 'Neptune', fromLocation, 'location-neptune-gravity', false));
		tr.append(GetLocationCard2('Neptune Fly-By', 'Neptune<br/>Fly-By', fromLocation, 'location-neptune-gravity', (fromLocation == 'Uranus Fly-By')));
		tr.append(GetLocationCard2('Uranus Fly-By', 'Uranus<br/>Fly-By', fromLocation, 'location-uranus-gravity', (fromLocation == 'Outer Plan Trans' || fromLocation == 'Saturn Fly-By')));
		tr.append(GetLocationCard2('Uranus', 'Uranus', fromLocation, 'location-uranus-gravity', false));
		tr.append(GetLocationCard2('Saturn', 'Saturn', fromLocation, 'location-saturn-gravity', false));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetLocationCard2('Jupiter', 'Jupiter', fromLocation, 'location-jupiter-gravity', false));
		tr.append(GetLocationCard2('Europa', 'Europa', fromLocation, 'location-europa-gravity', (fromLocation == 'Jupiter Orbit')));
		tr.append(GetLocationCard2('Callisto', 'Callisto', fromLocation, 'location-callisto-gravity', (fromLocation == 'Jupiter Orbit')));
		tr.append(GetEmptyLocationCard2());
		tr.append(GetLocationCard2('Saturn Orbit', 'Saturn<br/>Orbit', fromLocation, 'location-saturn-gravity', (fromLocation == 'Saturn Fly-By' || fromLocation == 'Titan Orbit' || fromLocation == 'Enceladus')));
		tr.append(GetLocationCard2('Enceladus', 'Enceladus', fromLocation, 'location-enceladus-gravity', (fromLocation == 'Saturn Orbit')));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetLocationCard2('Io', 'Io', fromLocation, 'location-io-gravity', (fromLocation == 'Jupiter Orbit')));
		tr.append(GetLocationCard2('Ganymede Orbit', 'Ganymede<br/>Orbit', fromLocation, 'location-ceres-gravity', (fromLocation == 'Jupiter Orbit' || fromLocation == 'Ganymede')));
		tr.append(GetLocationCard2('Jupiter Orbit', 'Jupiter<br/>Orbit', fromLocation, 'location-jupiter-gravity', (fromLocation == 'Jupiter Fly-By' || fromLocation == 'Callisto' || fromLocation == 'Ganymede Orbit' || fromLocation == 'Europa' || fromLocation == 'Io')));
		tr.append(GetLocationCard2('Saturn Fly-By', 'Saturn<br/>Fly-By', fromLocation, 'location-saturn-gravity', (fromLocation == 'Outer Plan Trans' || fromLocation == 'Jupiter Fly-By' || fromLocation == 'Saturn Orbit')));
		tr.append(GetLocationCard2('Titan Orbit', 'Titan<br/>Orbit', fromLocation, 'location-titan-gravity', (fromLocation == 'Saturn Orbit' || fromLocation == 'Titan')));
		tr.append(GetLocationCard2('Titan', 'Titan', fromLocation, 'location-titan-gravity', (fromLocation == 'Titan Orbit' || fromLocation == 'Saturn Orbit')));
		table.append(tr);

		tr = $('<tr>', {
			'class': 'locations-row'
		});
		tr.append(GetEmptyLocationCard2());
		tr.append(GetLocationCard2('Ganymede', 'Ganymede', fromLocation, 'location-ceres-gravity', (fromLocation == 'Ganymede Orbit')));
		tr.append(GetLocationCard2('Jupiter Fly-By', 'Jupiter<br/>Fly-By', fromLocation, 'location-jupiter-gravity', (fromLocation == 'Outer Plan Trans' || fromLocation == 'Venus Fly-By' || fromLocation == 'Mars Fly-By' || fromLocation == 'Jupiter Orbit' || fromLocation == 'Callisto')));
		tr.append(GetLocationCard2('Outer Plan Trans', 'Outer', fromLocation, 'location-inner-plan-trans', (fromLocation == "Venus Orbit" || fromLocation == 'Earth Orbit' || fromLocation == 'Ceres' || fromLocation == 'Mars Orbit' || fromLocation == 'Uranus Fly-By' || fromLocation == 'Jupiter Fly-By' || fromLocation == 'Saturn Fly-By')));
		tr.append(GetEmptyLocationCard2());
		tr.append(GetEmptyLocationCard2());
		table.append(tr);
	}

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	// What "from-location" has one clicked in order to make Phobos lighten up?
	// Answer: Mars Orbit. 
	tr.append(GetEmptyLocationCard2());
	tr.append(GetLocationCard2('Phobos', 'Phobos', fromLocation, 'location-mars-gravity', (fromLocation == 'Mars Orbit')));
	tr.append(GetLocationCard2('Mars Fly-By', 'Mars<br/>Fly-By', fromLocation, 'location-mars-gravity', (fromLocation == 'Earth Orbit')));
	tr.append(GetLocationCard2('Ceres', 'Ceres', fromLocation, 'location-ceres-gravity', (fromLocation == 'Inner Plan Trans' || fromLocation == 'Outer Plan Trans')));
	tr.append(GetLocationCard2('Venus Orbit', 'Venus<br/>Orbit', fromLocation, 'location-venus-gravity', (fromLocation == 'Inner Plan Trans' || fromLocation == 'Venus Fly-By' || fromLocation == 'Venus')));
	tr.append(GetLocationCard2('Venus', 'Venus', fromLocation, 'location-venus-gravity', (fromLocation == 'Venus Orbit' || fromLocation == "Venus Fly-By")));
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard2());
	tr.append(GetLocationCard2('Mars', 'Mars', fromLocation, 'location-mars-gravity', (fromLocation == 'Mars Orbit' || fromLocation == "Mars Cycler" || fromLocation == 'Mars Fly-By')));
	tr.append(GetLocationCard2('Mars Orbit', 'Mars<br/>Orbit', fromLocation, 'location-mars-gravity', (fromLocation == 'Mars' || fromLocation == "Mars Cycler" || fromLocation == 'Mars Fly-By' || fromLocation == 'Earth Orbit' || fromLocation == 'Inner Plan Trans' || fromLocation == 'Phobos' || fromLocation == 'Outer Plan Trans')));
	tr.append(GetLocationCard2('Inner Plan Trans', 'Inner', fromLocation, 'location-inner-plan-trans', (fromLocation == 'Earth Orbit' || fromLocation == 'Mars Orbit' || fromLocation == 'Venus Orbit' || fromLocation == 'Ceres' || fromLocation == 'Mercury Orbit')));
	tr.append(GetLocationCard2('Venus Fly-By', 'Venus<br/>Fly-By', fromLocation, 'location-venus-gravity', (fromLocation == 'Inner Plan Trans' || fromLocation == 'Venus Fly-By' || fromLocation == 'Venus')));
	tr.append(GetEmptyLocationCard2());
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetLocationCard2('Mercury Fly-By', 'Mercury<br/>Fly-By', fromLocation, 'location-mercury-gravity', (fromLocation == 'Inner Plan Trans')));
	tr.append(GetLocationCard2('Mercury Orbit', 'Mercury<br/>Orbit', fromLocation, 'location-mercury-gravity', (fromLocation == 'Mercury Fly-By' || fromLocation == 'Mercury')));
	if (settings.IncludeStations) {
		tr.append(GetLocationCard2('Mars Cycler', 'Mars<br/>Cycler', fromLocation, 'location-mars-gravity', (fromLocation == 'Mars Orbit' || fromLocation == 'Earth Cycler')));
	}
	else {
		tr.append(GetEmptyLocationCard2());
	}
	tr.append(GetLocationCard2('Earth Orbit', 'Earth<br/>Orbit', fromLocation, 'location-earth-gravity', (fromLocation == 'Earth' || fromLocation == "Earth Cycler" || fromLocation == 'Suborbital Space' || fromLocation == 'Inner Plan Trans' || fromLocation == 'Mars Orbit' || fromLocation == 'Lunar Orbit' || fromLocation == "Lunar Fly-By" || fromLocation == 'Outer Plan Trans')));
	tr.append(GetLocationCard2('Lunar Orbit', 'Lunar<br/>Orbit', fromLocation, 'location-moon-gravity', (fromLocation == 'Earth Orbit' || fromLocation == 'Lunar Fly-By' || fromLocation == 'Moon')));
	tr.append(GetLocationCard2('Moon', 'Moon', fromLocation, 'location-moon-gravity', (fromLocation == 'Lunar Fly-By' || fromLocation == 'Lunar Orbit')));
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard2());
	tr.append(GetLocationCard2('Mercury', 'Mercury', fromLocation, 'location-mercury-gravity', (fromLocation == "Mercury Fly-By" || fromLocation == "Mercury Orbit")));
	if (settings.IncludeStations) {
		tr.append(GetLocationCard2('Earth Cycler', 'Earth<br/>Cycler', fromLocation, 'location-earth-gravity', (fromLocation == 'Earth Orbit' || fromLocation == 'Mars Cycler')));
	}
	else {
		tr.append(GetEmptyLocationCard2());
	}
	tr.append(GetLocationCard2('Suborbital Space', 'Suborb.<br/>Space', fromLocation, 'location-earth-gravity', (fromLocation == "Earth")));
	tr.append(GetLocationCard2('Lunar Fly-By', 'Lunar<br/>Fly-By', fromLocation, 'location-moon-gravity', (fromLocation == "Earth Orbit")));
	tr.append(GetEmptyLocationCard2());
	table.append(tr);

	tr = $('<tr>', {
		'class': 'locations-row'
	});
	tr.append(GetEmptyLocationCard2());
	// Make room for aerobraking maneuvers
	tr.append(GetAerobrakingLocationCard2(fromLocation));
	// Outer Plan Trans has two aerobraking maneuvers
	if (settings.IncludeOuterPlanets && fromLocation == "Outer Plan Trans") {
		var td = GetLocationCard2("Earth Orbit", "Earth<br/>Orbit", fromLocation, "location-earth-gravity", true, true);
		td.append('<br/><img style="height: 25%;" src="images/aerobraking.png" />');
		tr.append(td);
	}
	else {
		tr.append(GetEmptyLocationCard2());
	}
	tr.append(GetLocationCard2('Earth', 'Earth', fromLocation, 'location-earth-gravity', (fromLocation == "Suborbital Space" || fromLocation == "Earth Orbit")));
	tr.append(GetEmptyLocationCard2());
	tr.append(GetEmptyLocationCard2());
	table.append(tr);

	$('#dialog-manuevers-2').append(table);

}

function GetManueverHtmlString(man, percent) {

	var htmlString = "";

	// Slingshot
	if (man.Slingshot != null)
		htmlString += '<img style="height: ' + percent + ';" src="images/' + man.Slingshot + '.png" />';

	// Exclamation or Difficulty
	if (man.Exclamation) {
		htmlString += '<img style="height: ' + percent + ';" src="images/exclamation.png" />';
	}
	else {
		htmlString += '<img style="height: ' + percent + ';" src="images/' + man.Difficulty + '.png" />';
	}

	// SolarRadiation
	if (man.SolarRadiation) {
		htmlString += '<img style="height: ' + percent + ';" src="images/solar-radiation.png" />';
	}

	// Hourglasses
	if (man.Hourglasses > 3) {
		htmlString += '<img style="height: ' + percent + ';" src="images/hourglass.png" />';
		htmlString += ' x' + man.Hourglasses;
	}
	else {
		for (var i = 0; i < manuever.Hourglasses; i++)
			htmlString += '<img style="height: ' + percent + ';" src="images/hourglass.png" />';
	}

	// Optional hourlgass
	if (man.OptionalHourglass) {
		htmlString += '(<img style="height: ' + percent + ';" src="images/hourglass.png" />)';
	}

	// Aerobraking
	if (man.Aerobraking) {
		htmlString += '<img style="height: ' + percent + ';" src="images/aerobraking.png" />';
	}

	// Reentry
	if (man.Reentry)
		htmlString += '<img style="height: ' + percent + ';" src="images/reentry.png" />';

	// Landing
	if (man.Landing)
		htmlString += '<img style="height: ' + percent + ';" src="images/landing.png" />';

	// OptionalLanding
	if (man.OptionalLanding)
		htmlString += '(<img style="height: ' + percent + ';" src="images/landing.png" />)';

	return htmlString;
}

function UpdateQuantityDiv(componentsArray, containerId, componentName, quantity) {
	$(containerId + ' .quantity[data-component-name="' + componentName + '"]').text(quantity);
	if (quantity == "-1")
	{
		DeleteComponent(componentsArray, componentName, containerId);
	}
	else if (quantity == "0")
	{
		$('.component-container[data-container-id="' + containerId + '"][data-component-name="' + componentName + '"]').css('opacity', '0.4');
	}
	else
	{
		$('.component-container[data-container-id="' + containerId + '"][data-component-name="' + componentName + '"]').css('opacity', '1');		
	}
}

function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

function ClearCraft() {
	payload = [];
	rockets = [];
	localStorage.setItem("lastPayload", JSON.stringify(payload));
	localStorage.setItem("lastRockets", JSON.stringify(rockets));
	$('#rockets-container').html('');
	$('#payload-container').html('');
	UpdateAllValues();
}

function CloneManuever(man) {
	var copy = {
		Name: man.From + " to " + man.To,
		From: man.From,
		To: man.To,
		Difficulty: man.Difficulty,
		Exclamation: man.Exclamation,
		Aerobraking: man.Aerobraking,
		Slingshot: man.Slingshot,
		Hourglasses: man.Hourglasses,
		OptionalHourglass: man.OptionalHourglass,
		SolarRadiation: man.SolarRadiation,
		Reentry: man.Reentry,
		Landing: man.Landing,
		OptionalLanding: man.OptionalLanding,
		BackgroundClass: man.BackgroundClass,
	};
	return copy;
}

// ------------------------------------------------------------
// Dialogs
// ------------------------------------------------------------
function InitDialogComponents() {
	$("#dialog-components").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		width: '80%',
		modal: true,
		position: { my: "center", at: "center", of: window },
		title: "ROCKETS",
		dialogClass: "dialog-components",
		show: {
			effect: "blind",
			duration: 200
		},
		open: function () {
			jQuery('.ui-widget-overlay').bind('click', function () {
				jQuery('#dialog-components').dialog('close');
			})
		}
	});
}

function InitDialogManuevers() {
	$("#dialog-manuevers").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		width: '98%',
		modal: true,
		position: { my: "center top", at: "center top+50", of: window },
		title: "Choose location",
		dialogClass: "dialog-manuevers",
		// show: {
		// effect: "blind",
		// duration: 200
		// },
		open: function () {
			jQuery('.ui-widget-overlay').bind('click', function () {
				jQuery('#dialog-manuevers').dialog('close');
			})
		}
	});
}

function InitDialogManuevers2() {
	$("#dialog-manuevers-2").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		width: '98%',
		modal: true,
		position: { my: "center top", at: "center top+50", of: window },
		title: "Choose location to",
		dialogClass: "dialog-manuevers",
		open: function () {
			jQuery('.ui-widget-overlay').bind('click', function () {
				jQuery('#dialog-manuevers-2').dialog('close');
			})
		}
	});
}

function InitDialogOptions() {
	$("#dialog-options").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		width: '80%',
		modal: true,
		position: { my: "center", at: "center", of: window },
		title: "Options",
		dialogClass: "dialog-options",
		show: {
			effect: "blind",
			duration: 200
		},
		open: function () {
			jQuery('.ui-widget-overlay').bind('click', function () {
				jQuery('#dialog-options').dialog('close');
			})
		}
	});
}


//MW - 2 new functions
function CheckForShuttle() {
    /* MW - new loop that manually adds Fuel Tank to Payload. This keeps a minimum number of Fuel Tanks, but won't remove any */
    if (settings.IncludeStations) {
        for (var i = 0; i < rockets.length; i++) {
            for (var j = 0; j < shuttles.length; j++) {
                if (rockets[i].Name == shuttles[j].Name) {
                    var tank = FindComponent(payload, shuttles[j].Tank)
                    if (tank == null) {
                        var tank = FindComponent(components, shuttles[j].Tank);
                        tank.Quantity = Number(rockets[i].Quantity);
                        AddComponentToSpacecraft(payload, tank);
                    } else {
                        var x = (Number(rockets[i].Quantity) - Number(tank.Quantity)); 
                        if (x > 0) { 
                            tank.Quantity = Number(tank.Quantity) + x;
                        }
                    }
                    CreateSpacecraftDivs(payload, "#payload-container");    
                }
            }
        }
    }	
}

function CheckMinus(button, component) {
     if (settings.IncludeStations) {
        for (var k = 0; k < shuttles.length; k++) {
            if (component.Name == shuttles[k].Tank) {
                var shuttle = FindComponent(rockets, shuttles[k].Name);
                if (shuttle == null) {
                   break;
                } else {
                    if (shuttle.Quantity == component.Quantity) {  
                        button.css('opacity', '0');
                        button.disabled = true;
                    } else {
                        button.css('opacity', '100');
                        button.disabled = false;
                    }
                }
            }
        }
     }              
}

var components = [

	// Probes
	{ Quantity: "1", Name: "Probe", Sort: "a", Type: "probe", "Class": "blue", Mass: "1", Thrust: "0", Cost: "2", Seats: "0", Expansion: "" },
	{ Quantity: "1", Name: "Galileo", Sort: "b", Type: "probe", "Class": "blue", Mass: "2", Thrust: "0", Cost: "5", Seats: "0", Expansion: "Outer Planets" },
	{ Quantity: "1", Name: "Rover", Sort: "c", Type: "probe", "Class": "brown", Mass: "1", Thrust: "0", Cost: "4", Seats: "0", Expansion: "Stations" },

	// Capsules
	{ Quantity: "1", Name: "Eagle", Sort: "a", Type: "capsule", "Class": "blue", Mass: "1", Thrust: "0", Cost: "4", Seats: "2", Expansion: "" },
	{ Quantity: "1", Name: "Vostok", Sort: "b", Type: "capsule", "Class": "black", Mass: "2", Thrust: "0", Cost: "2", Seats: "1", Expansion: "" },
	{ Quantity: "1", Name: "Apollo", Sort: "c", Type: "capsule", "Class": "black", Mass: "3", Thrust: "0", Cost: "4", Seats: "3", Expansion: "" },
	{ Quantity: "1", Name: "Aldrin", Sort: "d", Type: "capsule", "Class": "blue", Mass: "3", Thrust: "0", Cost: "4", Seats: "8", Expansion: "" },
	{ Quantity: "1", Name: "Ground Habitat", Sort: "e", Type: "capsule", "Class": "brown", Mass: "5", Thrust: "0", Cost: "4", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Space Habitat", Sort: "f", Type: "capsule", "Class": "blue", Mass: "9", Thrust: "0", Cost: "20", Seats: "20", Expansion: "Stations" },

	// Rockets
        //MW - changed Sort for Daedalus to H and Shuttle to I ;
	{ Quantity: "1", Name: "Ion", Sort: "a", Type: "rocket", "Class": "blue", Mass: "1", Thrust: "5", Cost: "10", Seats: "0", Expansion: "" },
	{ Quantity: "1", Name: "Juno", Sort: "c", Type: "rocket", "Class": "red", Mass: "1", Thrust: "4", Cost: "1", Seats: "0", Expansion: "" },	
	{ Quantity: "1", Name: "Atlas", Sort: "d", Type: "rocket", "Class": "red", Mass: "4", Thrust: "27", Cost: "5", Seats: "0", Expansion: "" },	
	{ Quantity: "1", Name: "Proton", Sort: "e", Type: "rocket", "Class": "red", Mass: "6", Thrust: "70", Cost: "12", Seats: "0", Expansion: "Outer Planets" },
	{ Quantity: "1", Name: "Soyuz", Sort: "f", Type: "rocket", "Class": "red", Mass: "9", Thrust: "80", Cost: "8", Seats: "0", Expansion: "" },
	{ Quantity: "1", Name: "Saturn", Sort: "g", Type: "rocket", "Class": "red", Mass: "20", Thrust: "200", Cost: "20", Seats: "0", Expansion: "" },
	{ Quantity: "1", Name: "Daedalus", Sort: "h", Type: "rocket", "Class": "blue", Mass: "1", Thrust: "15", Cost: "10", Seats: "0", Expansion: "Stations" },	
	{ Quantity: "1", Name: "Shuttle", Sort: "i", Type: "rocket", "Class": "blue", Mass: "4", Thrust: "75", Cost: "10", Seats: "6", Expansion: "Stations" },		

	// Supplies and Other
	{ Quantity: "1", Name: "Supplies", Sort: "a", Type: "other", "Class": "green", Mass: "1", Thrust: "0", Cost: "1", Seats: "0", Expansion: "" },	
	{ Quantity: "1", Name: "Food", Sort: "a", Type: "other", "Class": "green", Mass: "1", Thrust: "0", Cost: "1", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Medical", Sort: "b", Type: "other", "Class": "green", Mass: "1", Thrust: "0", Cost: "1", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Spare Parts", Sort: "c", Type: "other", "Class": "green", Mass: "1", Thrust: "0", Cost: "1", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Experiment", Sort: "d", Type: "other", "Class": "green", Mass: "1", Thrust: "0", Cost: "2", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Sample", Sort: "e", Type: "other", "Class": "brown", Mass: "1", Thrust: "0", Cost: "0", Seats: "0", Expansion: "" },
	{ Quantity: "1", Name: "Explorer", Sort: "f", Type: "other", "Class": "blue", Mass: "1", Thrust: "0", Cost: "3", Seats: "0", Expansion: "Outer Planets" },
	
	// Modules and Fuel (Stations)	
           //MW - changed Fuel Tank Sort to H and I;
	{ Quantity: "1", Name: "Science Module", Sort: "a", Type: "module", "Class": "blue", Mass: "2", Thrust: "0", Cost: "5", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Medical Module", Sort: "b", Type: "module", "Class": "blue", Mass: "3", Thrust: "0", Cost: "5", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Hydroponics", Sort: "c", Type: "module", "Class": "blue", Mass: "4", Thrust: "0", Cost: "10", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Fuel Generator", Sort: "d", Type: "module", "Class": "gray", Mass: "4", Thrust: "0", Cost: "8", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Fuel Tank (small)", Sort: "h", Type: "module", "Class": "red", Mass: "2", Thrust: "0", Cost: "3", Seats: "0", Expansion: "Stations" },
	{ Quantity: "1", Name: "Fuel Tank (large)", Sort: "i", Type: "module", "Class": "red", Mass: "4", Thrust: "0", Cost: "4", Seats: "0", Expansion: "Stations" }	
	
];

const axios = require('axios');
const devices = require('../devices.json'); // Adjust the path if necessary

async function handleSwitch(response) {
    response.actions.forEach(action => {
        let actionName = 'switch';
        const dev = devices.find(device => device.name === action.device);
        if (dev.name === 'DEVICE_LAMEL') {
            actionName = 'light';
        }
        if (dev.name === 'DEVICE_TV') {
            actionName = 'remote';
        }

	if(dev.name === 'DEVICE_AC'){
	    actionName = 'climate';
        }

	let act = '';
	let reqBody ='';

	if(actionName === 'climate'){
		act = 'set_hvac_mode';
		const onOrOff = action.mode === 'on' ? 'cool' : 'off';
		reqBody = {"entity_id": dev.id, "hvac_mode": onOrOff};
	}
	else {
		act = action.mode === 'on' ? 'turn_on' : 'turn_off';
		reqBody = {"entity_id": dev.id};
	}
	const url = `http://...:8123/api/services/${actionName}/${act}`
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Authorization': 'Bearer ...',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(reqBody)
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    });
}

module.exports = handleSwitch;

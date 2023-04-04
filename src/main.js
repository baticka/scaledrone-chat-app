/* Global variables */
const messageContainer = document.querySelector('.message-container');
const membersList = document.querySelector('.members-list');
const messageForm = document.querySelector('form');
const messageFormButton = document.querySelector('.message-form__button');

let messageInput = document.querySelector('.message-form__input');
let members = [];
const firstName = [
		'Donald',
		'Mickey',
		'Minnie',
		'Pluto',
		'Daisy',
		'Goofy',
		'Scrooge',
		'Moby',
	];
const lastName = [
		'Duck',
		'Mouse',
		'Frog',
		'McQuack',
		'Goof',
		'McDuck',
		'Vanderquack',
		'Pistoles',
	];

const getRandomInt = () => {
	return Math.floor(Math.random() * element);
};

/* Get random name for each member */
const getMemberName = () => {
	element = firstName.length;
	return `${firstName[getRandomInt()]} ${lastName[getRandomInt()]}`;
};

/* Get random color for each member name */
const getMemberColor = () => {
	element = 256;
	return `rgb(${getRandomInt()}, ${getRandomInt()}, ${getRandomInt()})`;
};

const drone = new Scaledrone('USZQvKl3q84qn0Yy', {
	data: {
		name: getMemberName(),
		color: getMemberColor(),
	},
});

/* Start scaledrone and open chat room */
drone.on('open', (error) => {
	if (error) {
		alert('Something went wrong, try again');
	}

	const room = drone.subscribe('observable-room');
	room.on('open', function (error) {
		if (error) {
			alert('Something went wrong, try again');
		}
	});

	/* Display list of members in the room across all opent windows */
	room.on('members', (member) => {
		members = member;
		updateMembers();
	});

	/* Display members + messages respectively on enter or button click */
	room.on('message', (message) => {
		createMessageElement(message.data, message.member);
	});

	/* If chat opened in more than 2 windows update array with +1 member for each window */
	room.on('member_join', (member) => {
		members.push(member);
		updateMembers();
	});

	/* Check if member id exists, if not remove member from chat */
	room.on('member_leave', ({ id }) => {
		const index = members.findIndex((member) => member.id === id);
		members.splice(index, 1);

		updateMembers();
	});
});

const sendMessage = () => {
	const regExp = new RegExp('^[^\S.*$0-9A-Za-z]+$');
	if (regExp.test(messageInput.value)) {
		alert(
			'Type something, blank message is no fun'
		);
	} else {
		if (messageInput.value) {
			/* observable-room - listen to members join and leave chat */
			drone.publish({
				room: 'observable-room',
				message: messageInput.value,
			});
		} else {
			alert(
				'Type something, blank message is no fun'
			);
		}
		messageInput.value = '';
	}
};
messageFormButton.addEventListener('click', sendMessage);

/* Fetch inital assigned member name, compare it with
	memeber who sent a message and if the same add class
	to move parent div to the end of the window
*/
const getMessageMemberName = () => {
	let nameContainerElParent = document.querySelectorAll(
		'.message-container > div'
	);
	let nameContainerElement = document.querySelectorAll(
		'.message-container > div > div:nth-child(1)'
	);

	for (let index = 0; index < nameContainerElement.length; index++) {
		const nameContainerParent = nameContainerElParent[index];
		const nameContainer = nameContainerElement[index];
		const nameContainerText = nameContainerElement[index].innerText;

		if (nameContainerText) {
			nameContainer.innerHTML == drone.args[1].data.name
				? nameContainerParent.classList.add('message-end')
				: nameContainerParent.classList.add('message-start');
		}
	}
};

/* Update members list when new member joins in */
const updateMembers = () => {
	membersList.innerHTML = '';
	members.forEach((member) =>
		membersList.appendChild(createMemberElement(member))
	);
};

/* Create new member and assign color to name */
const createMemberElement = (member) => {
	const createDiv = document.createElement('div');

	createDiv.innerText = member.clientData.name;
	createDiv.style.color = member.clientData.color;

	return createDiv;
};

/* Create message block, add member and attach respective messages */
const createMessageElement = (data, member) => {
	const newMember = createMemberElement(member),
		createInnerDiv = document.createElement('div'),
		newMessage = document.createTextNode(data),
		createDiv = document.createElement('div');

	createInnerDiv.append(newMessage);
	createDiv.append(newMember, createInnerDiv);
	messageContainer.appendChild(createDiv);

	getMessageMemberName();
};

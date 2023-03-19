/* Global variables */
const messageContainer = document.querySelector('.message-container'),
	membersList = document.querySelector('.members-list'),
	messageForm = document.querySelector('form'),
	messageFormButton = document.querySelector('.message-form__button');

let messageInput = document.querySelector('.message-form__input'),
	members = [],
	firstName = [
		'Donald',
		'Mickey',
		'Minnie',
		'Pluto',
		'Daisy',
		'Goofy',
		'Scrooge',
		'Moby',
	],
	lastName = [
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
	return Math.floor(Math.random() * elementValue);
};

/* Get random name for each member */
const getMemberName = () => {
	elementValue = firstName.length;
	return `${firstName[getRandomInt()]} ${lastName[getRandomInt()]}`;
};

/* Get random color for each member name */
const getMemberColor = () => {
	elementValue = 256;
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
		return console.error(error);
	}

	const room = drone.subscribe('observable-room');
	room.on('open', function (error) {
		if (error) {
			return console.error(error);
		}
	});

	/* Display list of members in the room across all opent windows */
	room.on('members', (member) => {
		members = member;
		updateMembers();
	});

	/* Display members + messages respectively on enter or button click */
	room.on('message', (message) => {
		const messageText = message.data,
			messageMember = message.member;

		createMessageElement(messageText, messageMember);
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
	const messageText = messageInput.value;
	if (messageText) {
		/* observable-room - listen to members join and leave chat */
		drone.publish({
			room: 'observable-room',
			message: messageText,
		});
	}
	messageInput.value = '';
};
messageFormButton.addEventListener('click', sendMessage);

/* Fetch name from "assignName" variable, compare it with
	memeber who sent a message and if the same add class
	to move parent div to the end of the window
*/
const getMessageMemberName = () => {
	const memeberName = drone.args[1].data.name;
	let nameContainerElParent = document.querySelectorAll(
			'.message-container > div'
		),
		nameContainerElement = document.querySelectorAll(
			'.message-container > div > div:nth-child(1)'
		);

	for (let index = 0; index < nameContainerElement.length; index++) {
		const nameContainerParent = nameContainerElParent[index],
			nameContainer = nameContainerElement[index],
			nameContainerText = nameContainerElement[index].innerText;

		if (nameContainerText) {
			nameContainer.innerHTML == memeberName
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
	const getMember = member.clientData,
		createDiv = document.createElement('div');

	createDiv.innerText = getMember.name;
	createDiv.style.color = getMember.color;

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

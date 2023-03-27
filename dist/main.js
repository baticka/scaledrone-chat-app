(() => {
	const e = document.querySelector('.message-container'),
		n = document.querySelector('.members-list'),
		o =
			(document.querySelector('form'),
			document.querySelector('.message-form__button'));
	let t = document.querySelector('.message-form__input'),
		r = [],
		a = [
			'Donald',
			'Mickey',
			'Minnie',
			'Pluto',
			'Daisy',
			'Goofy',
			'Scrooge',
			'Moby',
		];
	const c = () => Math.floor(Math.random() * element),
		s = new Scaledrone('USZQvKl3q84qn0Yy', {
			data: {
				name:
					((element = a.length),
					`${a[c()]} ${
						[
							'Duck',
							'Mouse',
							'Frog',
							'McQuack',
							'Goof',
							'McDuck',
							'Vanderquack',
							'Pistoles',
						][c()]
					}`),
				color: ((element = 256), `rgb(${c()}, ${c()}, ${c()})`),
			},
		});
	s.on('open', (e) => {
		e && alert('Something went wrong, try again');
		const n = s.subscribe('observable-room');
		n.on('open', function (e) {
			e && alert('Something went wrong, try again');
		}),
			n.on('members', (e) => {
				(r = e), l();
			}),
			n.on('message', (e) => {
				d(e.data, e.member);
			}),
			n.on('member_join', (e) => {
				r.push(e), l();
			}),
			n.on('member_leave', ({ id: e }) => {
				const n = r.findIndex((n) => n.id === e);
				r.splice(n, 1), l();
			});
	}),
		o.addEventListener('click', () => {
			t.value && s.publish({ room: 'observable-room', message: t.value }),
				(t.value = '');
		});
	const l = () => {
			(n.innerHTML = ''), r.forEach((e) => n.appendChild(m(e)));
		},
		m = (e) => {
			const n = document.createElement('div');
			return (
				(n.innerText = e.clientData.name),
				(n.style.color = e.clientData.color),
				n
			);
		},
		d = (n, o) => {
			const t = m(o),
				r = document.createElement('div'),
				a = document.createTextNode(n),
				c = document.createElement('div');
			r.append(a),
				c.append(t, r),
				e.appendChild(c),
				(() => {
					let e = document.querySelectorAll(
							'.message-container > div'
						),
						n = document.querySelectorAll(
							'.message-container > div > div:nth-child(1)'
						);
					for (let o = 0; o < n.length; o++) {
						const t = e[o],
							r = n[o];
						n[o].innerText &&
							(r.innerHTML == s.args[1].data.name
								? t.classList.add('message-end')
								: t.classList.add('message-start'));
					}
				})();
		};
})();

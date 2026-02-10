import { styled } from 'styled-components'
import { toast } from 'react-toastify'

export function ImageIcn({props}) {
	let src = props.src || null;
	let data = props.data || null;
	let content = props.content || null;

	switch (props.role) {
		case 'profile-photo': src = user.profilePhoto[props.size] || user.profilePhoto || '/svg/noimg.svg'; break;

		case 'notifications': {
			src = '/svg/notification-bell.svg' || '/svg/noimg.svg';
			if (props.data==0) data = null;
		}; break;

		default: src = props.src;
	}

	return(
		<div className={`img-icn ${props.role}`} data={data}>
			{src ? <img src={src} /> : <div>{content || ""}</div>}
		</div>
	)
}

export function errToast(err) {
    console.error(err);
    toast(err.message);
};
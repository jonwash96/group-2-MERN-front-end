import { styled } from 'styled-components'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { UserContext } from "../../contexts/UserContext";

export function ImageIcn(props) {
	const { user } = useContext(UserContext);
	let size = props.size || '100%';
	let src = props.src || null;
	let data = props.data || null;
	let content = props.content || null;

	let dstyle = {
		...props.dstyle,
		overflow:'hidden',
	}
	let istyle = {
		...props.istyle,
		height: size,
	}
	let tstyle = {
		...props.tstyle,
		fontSize: size==='100%' ? 'inherit' : size
	}
	if (props.options?.split(' ').includes('round')) dstyle['borderRadius'] = '50%';

	switch (props.role) {
		case 'profile-photo': {
			src = user?.photo?.url || '/default-profile-photo.jpg';
			istyle = {...istyle, borderRadius:'50%', margin: '0 1%', aspectRatio: '1/1'};
			dstyle = {...dstyle, display:'inline'};
		}; break;

		case 'notifications': {
			src = '/svg/noimg.svg';
			if (props.data==0) data = null;
		}; break;

		case 'ph': src = '/svg/noimg.svg'; break;

		default: src = props.src;
	}

	return(
		<div className={`img-icn ${props.role}`} data={data} style={dstyle}>
			{src ? <img src={src} style={istyle} /> : <div style={tstyle}>{content || ""}</div>}
		</div>
	)
}

export function errToast(err) {
    console.error(err);
    toast(err.message);
};

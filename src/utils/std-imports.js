import { useState, useEffect } from 'reaact'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
const navigate = useNavigate();
import { Router, Routes } from 'react-router'
import { ImageIcn, errToast } from '/gizmos' // Lib that includes various mini-components
import '/gizmos/bancroft-proto' // Lib that extends built-in prototypes with useful methods
import { toast } from 'react-toastify'
import { UserContext } from "../../contexts/UserContext";
const { setUser } = useContext(UserContext);

export async function Component(params) {
	return(null)
}
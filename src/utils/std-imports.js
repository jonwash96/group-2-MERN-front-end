import { useState, useEffect, useContext } from 'react'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
const navigate = useNavigate();
import { Router, Routes } from 'react-router'
import { ImageIcn, errToast } from '../../utils/gizmos' // Lib that includes various mini-components
import '/gizmos/bancroft-proto' // Lib that extends built-in prototypes with useful methods
import { toast } from 'react-toastify'
import { UserContext } from "../../contexts/UserContext";
const { user, setUser } = useContext(UserContext);

export default function Component(params) {
	return(null)
}
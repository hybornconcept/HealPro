export const API_ROUTES = {
	AUTH: {
		LOGIN: '/api/auth/sign-in',
		REGISTER: '/api/auth/sign-up',
		LOGOUT: '/api/auth/sign-out',
		ME: '/api/auth/session',
		GET_SESSION: '/api/auth/session'
	},
	FACILITIES: {
		GET_ALL: '/facilities'
	},
	CLIENTS: {
		GET_ALL: '/clients'
	},
	HMO: {
		STATS: '/hmo/stats',
		CREATE: '/api/hmos'
	},
	PATIENTS: {
		CREATE: '/api/patients',
		UPLOAD_ID: (id: string) => `/api/patients/${id}/upload-id`
	},
	HOSPITALS: {
		CREATE: '/api/hospitals',
		UPLOAD_DOCS: (id: string | number) => `/api/hospitals/${id}/upload-docs`
	},
	APPOINTMENTS: {
		CREATE: '/api/appointments'
	},
	ROLE: {
		CHECK: '/api/role'
	}
};

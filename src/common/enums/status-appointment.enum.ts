/**
 * * @description Enum para el estado de la cita
 * * @note En caso de modificar los valores, se debe modificar el enum en el frontend (StatusAppointment)
 */
export enum StatusAppointment {
	PENDIENTE = 'PENDIENTE', // CUANDO SE CREA UNA CITA
	PROGRAMADO = 'PROGRAMADO', // CUANDO SE PROGRAMA UNA CITA
	ATENDIDO = 'ATENDIDO', // CUANDO SE ATIENDE UNA CITA
	CANCELADO = 'CANCELADO', // CUANDO SE CANCELA UNA CITA
	NO_PROGRAMADO = 'NO_PROGRAMADO', // CUANDO NO SE PROGRAMA UNA CITA
}

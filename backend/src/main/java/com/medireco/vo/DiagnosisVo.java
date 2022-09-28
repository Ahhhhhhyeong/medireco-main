package com.medireco.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class DiagnosisVo {

	private Long no;
	private String opinion;
	private Long patientNo;
	private Long appointmentNo;
}

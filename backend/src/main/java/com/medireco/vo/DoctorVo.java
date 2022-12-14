package com.medireco.vo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class DoctorVo {
		
	@JsonProperty("appointmentNo")
	private Long appointmentNo;			// 예약번호
	private String appointmentDate; 	// 내원날짜
	private String appointmentRemark;	// 내원시 기록한 내용
	private Long status;				// 예약 상태
	
	@JsonProperty("patientNo")
	private Long patientNo;				// 환자번호
	private String patientName;				// 환자이름
	private String patientBirth;		// 생년월일
	
	private Long employeeNo;				// 직원번호
	private String employeeName;			// 직원이름
	
	private Long diagnosisNo;				// 진료번호
	@JsonProperty("opinion")
	private String diagnosisOpinion;		// 진료소견
	
	private String diseaseName; 			// 질병이름
	
	private String treatmentName;			// 치료약이름
	private String treat;					// 치료방식
	private String treatDose;				// 치료 약용량
	
	private String prescriptionName;		// 처방약이름
	private String prescriptionDose;		// 1회 복용량(단위포함)
	private Long prescriptionPrequency;	// 1회 투여횟수 
	private Long prescriptionDays;		// 투약일수
	private String prescriptionRemark;		// 처방기록(옵션, ex_식후 30분 후 복용)
//	
//	@JsonProperty("prescription") 
//    private Map<String, List<String>> prescription;
//	
//	@JsonProperty("treatment") 
//    private Map<String, List<String>> treatment;
//	
//	@JsonProperty("disease") 
//    private Map<String, List<String>> disease;
//	
		
}

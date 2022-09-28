package com.medireco.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class PrescriptionVo {

	private Long no;
	private String medicineName;
	private String dose;
	private Long dosingPrequency;
	private Long dosingDays;
	private String remark;
	private Long diagnosisNo;
}

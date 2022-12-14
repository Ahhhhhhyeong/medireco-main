package com.medireco.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class AttendanceScheduleVo {

	private Long no;
	private String startDate;
	private String endDate;
	private String status;
	private String remark;
	private int isConfirmed;
	private Long hospitalNo;
	private Long employeeNo;
	private String employeeName;
}

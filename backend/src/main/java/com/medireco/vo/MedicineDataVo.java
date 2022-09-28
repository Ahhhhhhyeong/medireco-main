package com.medireco.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class MedicineDataVo {

	private String medicineNumber;
	private String medicineName;
	private String medicineUnit;
	private int medicineSort;
}

package com.medireco.common.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medireco.common.service.CommonService;
import com.medireco.dto.JsonResult;
import com.medireco.vo.AppointmentVo;
import com.medireco.vo.AttendanceScheduleVo;

@RestController
@RequestMapping("/api/common")
public class CommonController {

	@Autowired
	private CommonService commonService;
	
//	@GetMapping("/attendanceSchedule")
//	public ResponseEntity<JsonResult> atttendanceScheduleList() {
//		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.findAttendanceScheduleList()));
//	}
	
	@GetMapping("/attendanceSchedule")
	public ResponseEntity<JsonResult> atttendanceScheduleList(
			@RequestParam(value="hospital", required = true, defaultValue = "1") int hospital,
			@RequestParam(value="startDate", required = true, defaultValue = "1") String startDate,
			@RequestParam(value="endDate", required = true, defaultValue = "1") String endDate
			) {		
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.findAttendanceScheduleList(hospital, startDate, endDate)));
	}
	
	@GetMapping("/attendanceScheduleTable")
	public ResponseEntity<JsonResult> attendanceScheduleDetails(@RequestParam(value="hospital", required = true, defaultValue = "1") Long no,
																@RequestParam(value="startDate", required = true, defaultValue = "1") String sdate) {
		System.out.println(no + "," + sdate);
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.findAttendanceScheduleByNo(no, sdate)));
	}
	
	@PostMapping("attendanceSchedule")
	public ResponseEntity<JsonResult> attendanceScheduleAdd(@RequestBody AttendanceScheduleVo attendanceScheduleVo){
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.addAttendanceSchedule(attendanceScheduleVo)));
	}
	
	@PutMapping("attendanceSchedule")
	public ResponseEntity<JsonResult> attendanceScheduleUpdate(@RequestBody HashMap<String, Object> param) {
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.updateAttendanceSchedule(param)));
	}
	
	@DeleteMapping("attendanceSchedule/{no}")
	public ResponseEntity<JsonResult> attendanceScheduleDelete(@PathVariable("no") Long no) {
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.deleteAttendanceSchedule(no)));
	}
	
	/*************** ?????? ?????? start ******************/
	@GetMapping("/menuList")
	public ResponseEntity<JsonResult> visitedRecordList(@RequestParam(value="hospital", required = true, defaultValue = "1") int hospital,
														@RequestParam(value="no", required = false, defaultValue = "") long no,
														@RequestParam(value="role", required = true, defaultValue = "") String role,
														@RequestParam(value="page", required = false, defaultValue = "1") int page, Model model){
		Map<String, Object> map = commonService.visitedRecordList(hospital, no, role, page);
		model.addAttribute("map", map);
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(model));
	}
	
	@PutMapping("/menuList/{no}")
	public ResponseEntity<JsonResult> updateRecordList(@PathVariable("no") Long no, @RequestBody AppointmentVo appointmentVo){
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.updateRecordList(no, appointmentVo)));
	}
	
	@GetMapping("/visitedRecord")
	public ResponseEntity<JsonResult> visitedRecord(@RequestParam(value="hospital", required = true, defaultValue = "1") int hospital,													
													@RequestParam(value="date", required = true, defaultValue = "") String date,
													@RequestParam(value="page", required = true, defaultValue = "1") int page, 
													Model model){
		
		Map<String, Object> map = commonService.visitedRecord(hospital, date, page);
		model.addAttribute("map", map);
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(model));
	}
	
	@GetMapping("/recordDetail")
	public ResponseEntity<JsonResult> visitedRecordDetail (@RequestParam(value="hospital", required = true, defaultValue = "1") int hospital,
															@RequestParam(value="name", required = true, defaultValue = "") String name,
															@RequestParam(value="no", required = true, defaultValue = "1") int no,
															@RequestParam(value="detailPage", required = true, defaultValue = "1") int detailPage,
															Model model){
		Map<String, Object> map = commonService.visitedRecordDetail(hospital, name, no, detailPage);
		model.addAttribute("map", map);
		
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(model));
	}
	
	@GetMapping("/doctorlist/{hno}")
	public ResponseEntity<JsonResult> getDoctorList(@PathVariable("hno") Long no){
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.getDoctorList(no)));
	}
	
	@PutMapping("/doctorupdate/{no}")
	public ResponseEntity<JsonResult> updateDoctor(@PathVariable("no") Long no, @RequestBody AppointmentVo appointmentVo){
		return ResponseEntity.status(HttpStatus.OK).body(JsonResult.success(commonService.doctorupdate(appointmentVo)));
	}
	
	/*************** ?????? ?????? end ******************/
}

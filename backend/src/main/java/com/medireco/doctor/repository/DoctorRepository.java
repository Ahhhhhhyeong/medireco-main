package com.medireco.doctor.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.medireco.vo.AppointmentVo;
import com.medireco.vo.DiagnosisVo;
import com.medireco.vo.DiseaseDataVo;
import com.medireco.vo.DiseaseVo;
import com.medireco.vo.DoctorVo;
import com.medireco.vo.MedicineDataVo;
import com.medireco.vo.PrescriptionVo;
import com.medireco.vo.TreatmentVo;

@Repository
public class DoctorRepository {

	@Autowired
	private SqlSession sqlSession;

	public List<DoctorVo> getTreatList(Long no) {
		return sqlSession.selectList("doctor.getTreatList", no);
	}
	
	public Object getTreatCount(Long no) {
		return sqlSession.selectOne("doctor.getTreatCount", no);
	}

	public List<DiseaseDataVo> getModalDiease(String name, int page) {
		Map<String, Object> map = new HashMap<>();
		map.put("name", name);
		map.put("page", page);
		
		return sqlSession.selectList("doctor.getDiease", map);
	}

	public List<MedicineDataVo> getModalPrescription(String name, int page) {
		Map<String, Object> map = new HashMap<>();
		map.put("name", name);
		map.put("page", page);
		
		return sqlSession.selectList("doctor.getMedicine", map);
	}

	public List<MedicineDataVo> getModalTreatment(String name, int page) {
		Map<String, Object> map = new HashMap<>();
		map.put("name", name);
		map.put("page", page);
		
		return sqlSession.selectList("doctor.getTreatment", map);
	}

	public Boolean doctorSuccess(DiagnosisVo diagnosisVo) {
		return sqlSession.insert("doctor.insertDiagnosis", diagnosisVo) == 1;
	}

	public Boolean insertPrescription(List<Object> prescription, long no) {
		boolean result = false;
		for(int i = 0; i < prescription.size(); i++) {
			Map<String, Object> map = (Map<String, Object>)prescription.get(i);			
			map.put("diagnosisNo", no);			
			String fullDose = map.get("dose").toString() + map.get("medicineUnit").toString();
			map.put("fullDose", fullDose);
			//sSystem.out.println(map);
			result = sqlSession.insert("doctor.insertPrescription", map) == 1;
		}
		return result;
	}

	public Boolean insertDisease(List<Object> disease, long no) {
		boolean result = false;
		for(int i = 0; i < disease.size(); i++) {
			Map<String, Object> map = (Map<String, Object>)disease.get(i);
			map.put("diagnosisNo", no);
			result = sqlSession.insert("doctor.insertDisease", map) == 1;
		}
		return result;
	}

	public Boolean insertTreatment(List<Object> treatment, long no) {
		boolean result = false;
		if(treatment.size() < 1) {
			return result;
		}
		
		for(int i = 0; i < treatment.size(); i++) {
			Map<String, Object> map = (Map<String, Object>)treatment.get(i);
			map.put("diagnosisNo", no);
			String fullDose = map.get("dose").toString() + map.get("medicineUnit").toString();
			map.put("fullDose", fullDose);
			
			result = sqlSession.insert("doctor.insertTreatment", map) == 1;
		}
		return result;		
	}

	public Boolean updateAppointment(AppointmentVo appointmentVo) {
		return sqlSession.update("doctor.updateAppointment", appointmentVo) == 1;
	}

	public int dieaseTotalCount(String keyword) {
		return sqlSession.selectOne("doctor.dieaseCount", keyword);
	}

	public int prescriptionCount(String name) {
		return sqlSession.selectOne("doctor.medicineCount", name);
	}

	public int treatmentCount(String name) {
		return sqlSession.selectOne("doctor.injectionCount", name);
	}

	
	
	
}

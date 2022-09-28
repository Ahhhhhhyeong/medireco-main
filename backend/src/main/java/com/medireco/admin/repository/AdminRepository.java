package com.medireco.admin.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.medireco.vo.DiseaseDataVo;
import com.medireco.vo.EmployeeVo;
import com.medireco.vo.HospitalVo;
import com.medireco.vo.MedicineDataVo;

@Repository
public class AdminRepository {

	@Autowired
	private SqlSession sqlSession;

	public List<HospitalVo> findAll(String keyword) {
		return sqlSession.selectList("admin.findAll", keyword);
	}

	public HospitalVo findByNo(Long no) {
		return sqlSession.selectOne("admin.findByNo", no);
	}

	public Boolean insertHospital(HospitalVo hospitalVo) {
		return sqlSession.insert("admin.insertHospital", hospitalVo) == 1;
	}

	public Boolean insertHospitalAdmin(EmployeeVo employeeVo) {
		return sqlSession.insert("admin.insertHospitalAdmin", employeeVo) == 1;
	}

	public Boolean updateIsActive(Long no) {
		return sqlSession.update("admin.updateIsActive", no) == 1;
	}

	public Boolean deleteHospitalAdmin(Long no) {
		return sqlSession.delete("admin.deleteHospitalAdmin", no) == 1;
	}

	public Boolean updateHospital(HospitalVo hospitalVo) {
		return sqlSession.update("admin.updateHospital", hospitalVo) == 1;
	}

	public Boolean updateHospitalAdmin(EmployeeVo employeeVo) {
		return sqlSession.update("admin.updateHospitalAdmin", employeeVo) == 1;
	}

	public List<DiseaseDataVo> findAllDiseaseData(String keyword) {
		return sqlSession.selectList("admin.findAllDiseaseData", keyword);
	}

	public List<MedicineDataVo> findAllMedicineData(String keyword) {
		return sqlSession.selectList("admin.findAllMedicineData", keyword);
	}
}

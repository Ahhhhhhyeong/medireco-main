package com.medireco.auth;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.medireco.vo.EmployeeVo;

@Repository
public class SecurityRepository {

	@Autowired
	private SqlSession sqlSession;

	public EmployeeVo findByEmail(String email) {
		return sqlSession.selectOne("auth.findByEmail", email);
		
	}

}

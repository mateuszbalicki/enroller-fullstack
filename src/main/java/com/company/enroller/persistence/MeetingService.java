package com.company.enroller.persistence;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component("meetingService")
public class MeetingService {

    Session session;

    public MeetingService() {
        session = DatabaseConnector.getInstance().getSession();
    }

    public Collection<Meeting> getAll() {
        String hql = "FROM Meeting";
        Query query = this.session.createQuery(hql);
        return query.list();
    }

    public Meeting findById(long id) {
        String hql = "SELECT DISTINCT meeting FROM Meeting as meeting LEFT JOIN FETCH meeting.participants WHERE meeting.id = :id";
        Query query = this.session.createQuery(hql).setParameter("id", id);
        return (Meeting) query.uniqueResult();
    }

    public Collection<Meeting> findMeetings(String title, String description, Participant participant, String sortMode) {
        String hql = "SELECT DISTINCT meeting FROM Meeting as meeting LEFT JOIN FETCH meeting.participants WHERE meeting.title LIKE :title AND meeting.description LIKE :description ";
        if (participant != null) {
            hql += " AND :participant in elements(meeting.participants)";
        }
        if (sortMode.equals("title")) {
            hql += " ORDER BY meeting.title";
        }
        Query query = this.session.createQuery(hql);
        query.setParameter("title", "%" + title + "%").setParameter("description", "%" + description + "%");
        if (participant != null) {
            query.setParameter("participant", participant);
        }
        return query.list();
    }

    public void delete(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.delete(meeting);
        transaction.commit();
    }

    public void add(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.save(meeting);
        transaction.commit();
    }

    public void update(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.merge(meeting);
        transaction.commit();
    }

    public boolean alreadyExist(Meeting meeting) {
        String hql = "FROM Meeting WHERE title=:title AND date=:date";
        Query query = this.session.createQuery(hql);
        Collection resultList = query.setParameter("title", meeting.getTitle()).setParameter("date", meeting.getDate())
                .list();
        return resultList.size() != 0;
    }

}
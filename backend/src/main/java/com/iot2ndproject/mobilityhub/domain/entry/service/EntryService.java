package com.iot2ndproject.mobilityhub.domain.entry.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.entry.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;

public interface EntryService {

    WorkInfoEntity handleEntry(OcrEntryRequest req);

    List<EntranceEntryView> getTodayEntry();
    void approveEntrance(Long workId);
}

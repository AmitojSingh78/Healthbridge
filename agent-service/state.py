from typing import TypedDict,Optional,List,Dict,Any


class AdmissionState(TypedDict,total = False):
    request:str
    
    patient_name:str
    doctor_name:str
    procedure_code:str
    requested_date:str
    
    patient:Optional[Dict[str,Any]]
    
    doctor:Optional[Dict[str,Any]]
    
    doctor_available:Optional[bool]
    
    procedure:Optional[Dict[str,Any]]
    
    available_beds: List[Dict[str, Any]]
    selected_bed: Optional[Dict[str, Any]]

    
    available_ots: List[Dict[str, Any]]
    selected_ot: Optional[Dict[str, Any]]

    
    completed_tests: List[str]
    missing_tests: List[str]
    draft_lab_orders: List[str]

    insurance: Optional[Dict[str, Any]]
   
    admission_plan: Optional[Dict[str, Any]]
    approved: Optional[bool]
    approval_notes: Optional[str]
    
    errors: List[str]
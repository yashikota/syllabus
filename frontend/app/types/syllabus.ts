interface BasicCourseInformation {
  semester: string;
  subject_number: string;
  class_code: string;
  class_name: string;
  course_type: string;
  teacher_training_course: string;
  number_of_credits: string;
  required_elective_etc: string;
  style: string;
  main_language: string;
  scheduling: string;
  subject_registration: string;
}

interface RegistrationCategory {
  is: {
    registration_class: string;
    core_subjects: string;
  };
  bs: {
    registration_class: string;
    core_subjects: string;
  };
  ms: {
    registration_class: string;
    core_subjects: string;
  };
  ds: {
    registration_class: string;
    core_subjects: string;
  };
  dgi: {
    registration_class: string;
    core_subjects: string;
  };
  registration_requirements: string;
}

interface Overview {
  supervising_lecturer: string;
  lecturer: string;
  learning_objective_goals: string;
  outline_teaching_method: string;
}

interface TextbookReference {
  textbook: string;
  reference_book: string;
}

interface OtherInformation {
  prerequisites: string;
  office_hour: string;
  grading: string;
  related_subjects: string;
  related_degrees: string;
  notice: string;
}

interface Schedule {
  number: string;
  datetime: string;
  room: string;
  lecturer: string;
  theme: string;
  content: string;
}

export interface Course {
  basic_course_information: BasicCourseInformation;
  registration_category: RegistrationCategory;
  overview: Overview;
  textbook_reference: TextbookReference;
  other_information: OtherInformation;
  url: string | string[] | null;
  references: string | string[] | null;
  schedule: Schedule[];
}

export interface Courses {
  [classCode: string]: Course;
}

/*
* VIEW MESSAGES
 */
export const messagesProperties = {
  accountDeactivation: {
    label: 'Vaš račun je bil uspešno deaktiviran. Če se premislite glede aktivacije, se vam bo ob ponovni prijavi, račun avtomatsko aktiviral'
  },
  resendEmail: {
    label: 'Na vaš email naslov ste prejeli pošto z potrditevnim linkom.'
  }
};

/*
* VIEW LABELS
 */
export const viewLabelProperties = {
  name: {
    label: 'Ime',
    value: '',
    formName: 'name'
  },
  lastName: {
    label: 'Priimek',
    value: '',
    formName: 'lastName'
  },
  email: {
    label: 'Email',
    value: '',
    formName: 'email'
  },
  postNumber: {
    label: 'Pošta',
    value: '',
    formName: 'postNumber'
  },
  phone: {
    label: 'Telefon',
    value: '',
    formName: 'phone'
  },
  password: {
    label: 'Geslo',
    value: '',
    formName: 'password'
  },
  passwordRepeat: {
    label: 'Ponovitev gesla',
    value: '',
    formName: 'passwordRepeat'
  },
  passwordCurrent: {
    label: 'Trenutno geslo',
    value: '',
    formName: 'passwordCurrent'
  },
  passwordNew: {
    label: 'Novo geslo',
    value: '',
    formName: 'passwordNew'
  },
  passwordConfirm: {
    label: 'Potrditev gesla',
    value: '',
    formName: 'passwordConfirm'
  },
  image: {
    label: '',
    value: '',
    formValue: ''
  },
  imagePicker: {
    label: 'Naloži fotografijo',
    value: '',
    formValue: ''
  },
  profile: {
    label: 'Profil',
    value: '',
    formValue: ''
  },
  changePassword: {
    label: 'Spremeni geslo',
    value: '',
    formValue: ''
  },
  title: {
    label: 'Naslov objave',
    value: '',
    formValue: 'title'
  },
  address: {
    label: 'Naslov lokacije',
    value: '',
    formValue: 'address'
  },
  category: {
    label: 'Kategorija',
    value: '',
    formValue: 'category'
  },
  dateTimeFrom: {
    label: 'Datum začetka',
    value: '',
    formValue: 'dateTimeFrom'
  },
  dateTimeTo: {
    label: 'Datum konca',
    value: '',
    formValue: 'dateTimeTo'
  },
  price: {
    label: 'Cena',
    value: '',
    formValue: 'price'
  },
  content: {
    label: 'Vsebina objave',
    value: '',
    formValue: 'content'
  },
  filtering: {
    label: 'Filtriranje rezultatov'
  },
  filteringCategory: {
    label: 'Kategorija',
  },
  filteringPost: {
    label: 'Pošta'
  },
  filteringAddress: {
    label: 'Naslov'
  },
  filteringDateTimeFrom: {
    label: 'Datum začetka'
  },
  filteringDateTimeTo: {
    label: 'Datum konca'
  }
};

/*
* BUTTONS/LINKS
 */
export const buttonProperties = {
  register: {
    label: 'Registracija',
    formName: 'register'
  },
  login: {
    label: 'Prijava',
    formName: 'login'
  },
  forgottenPassword: {
    label: 'Pozabljeno geslo?',
    formName: ''
  },
  send: {
    label: 'Pošlji',
    formName: 'send'
  },
  passwordUpdate: {
    label: 'Posodobi geslo',
    formName: 'passwordUpdate'
  },
  saveChanges: {
    label: 'Shrani spremembe',
    value: '',
    formValue: ''
  },
  firstPage: {
    label: 'Nazaj na prvo stran',
    value: '',
    formName: ''
  },
  resendEmail: {
    label: 'Ponovno pošlji potrditveni email',
    value: '',
    formName: ''
  },
  headerMyPosts: {
    label: 'Moje objave',
    value: '',
    formName: ''
  },
  headerMyjobs: {
    label: 'Moja dela',
    value: '',
    formName: ''
  },
  headerMyDashboard: {
    label: 'Moj dashboard',
    value: '',
    formName: ''
  },
  profile: {
    label: 'Profil',
    value: '',
    formName: ''
  },
  newPost: {
    label: 'Nova objava',
    value: '',
    formName: ''
  },
  logout: {
    label: 'Odjava',
    value: '',
    formName: ''
  },
  savePost: {
    label: 'Shrani objavo',
    value: '',
    formName: 'savePost'
  },
  resetFilter: {
    label: 'PONASTAVI',
    value: '',
    formName: ''
  }
};

/*
* VALIDATION MESSAGES
 */
export const validationMessages = {
  password: {
    required: 'Geslo je obvezno polje',
    minLength(minLength: string) {
      return `Geslo mora biti dolgo vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Geslo mora biti dolgo manj ali enako ${maxLength} znakov`;
    }
  },
  passwordRepeat: {
    required: 'Geslo je obvezno polje',
    minLength(minLength: string) {
      return `Geslo mora biti dolgo vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Geslo mora biti dolgo manj ali enako ${maxLength} znakov`;
    }
  },
  passwordCurrent: {
    required: 'Geslo je obvezno polje',
    minLength(minLength: string) {
      return `Geslo mora biti dolgo vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Geslo mora biti dolgo manj ali enako ${maxLength} znakov`;
    }
  },
  passwordNew: {
    required: 'Geslo je obvezno polje',
    minLength(minLength: string) {
      return `Geslo mora biti dolgo vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Geslo mora biti dolgo manj ali enako ${maxLength} znakov`;
    }
  },
  passwordConfirm: {
    required: 'Geslo je obvezno polje',
    minLength(minLength: string) {
      return `Geslo mora biti dolgo vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Geslo mora biti dolgo manj ali enako ${maxLength} znakov`;
    }
  },
  comparePasswords: {
    equal: 'Gesli se ne ujemata'
  },
  name: {
    required: 'Prosim vnesite veljavno ime',
    minLength(minLength: string) {
      return `Ime mora vsebovati vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Ime mora vsebovati manj ali enako ${maxLength} znakov`;
    }
  },
  lastName: {
    required: 'Prosim vnesite veljaven priimek',
    minLength(minLength: string) {
      return `Priimek mora vsebovati vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Priimek mora vsebovati manj ali enako ${maxLength} znakov`;
    }
  },
  phone: {
    required: 'Prosim vnesite veljavno telefonsko številko.',
    minLength(minLength: string) { return `Priimek mora vsebovati vsa ${minLength} znakov`; },
    maxLength(maxLength: string) { return `Telefonska številka mora vsebovati manj ali enako ${maxLength} znakov.`; },
    digitsOnly() { return `Telefonska številka vsebuje samo številke.`; },
  },
  content: {
    required: 'Vnos je obvezen',
    minLength(minLength: string) {
      return `Opis mora vsebovati vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Opis mora vsebovati manj ali enako ${maxLength} znakov`;
    }
  },
  email: {
    required: 'Prosim vnesite veljaven email'
  },
  title: {
    required: 'Prosim vnesite veljaven naslov',
    minLength(minLength: string) {
      return `Naslov mora vsebovati vsaj ${minLength} znakov`;
    },
    maxLength(maxLength: string) {
      return `Naslov mora vsebovati manj ali enako ${maxLength} znakov`;
    }
  },
  address: {
    required: 'Prosim vnesite veljaven naslov'
  },
  postNumber: {
    required: 'Vnos poštne številke je obvezen'
  },
  category: {
    required: 'Vnos kategorije je obvezen'
  },
  price: {
    required: 'Vnos cene je obvezen'
  }
};

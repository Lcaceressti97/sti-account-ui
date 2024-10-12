import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AdjustmentResponseById, TransactionResponse } from '../models/APIModels';
import { TransactionModel } from '../models/TransactionModel';
import { environment } from '@environment/environment';
import { LeaderAccounts } from 'src/app/modules/accounting/models/LeederAccountsDetail';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiURL = environment.API;

  /*------------------------------------------
  --------------------------------------------
  Http Header Options
  --------------------------------------------
  --------------------------------------------*/
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) { }

  /**
   * Method that brings a list with all the transactions
   *
   * @return response()
   */
  getAll(): Observable<any> {
    return this.httpClient
      .get(this.apiURL + '/api/v1/transaction')

      .pipe(catchError(this.errorHandler));
  }

  /**
   * Method to create a transaction
   *
   * @return response()
   */
  createTransaction(data: any): Observable<TransactionResponse> {
    return this.httpClient
      .post<TransactionResponse>(
        this.apiURL + '/api/v1/transaction',
        JSON.stringify(data),
        this.httpOptions
      )

      .pipe(catchError(this.errorHandler));
  }

  getAllTransactionByDocumentType(
    documentId: number
  ): Observable<TransactionResponse[]> {
    const url = `${this.apiURL}/api/v1/transaction/by-document/${documentId}`;
    return this.httpClient.get<TransactionResponse[]>(url).pipe(
      catchError(() => {
        console.error('catch error in service');
        return throwError(() => {
          return new Error('No se puedo obtener la data.');
        });
      })
    );
  }

  getTransactionByDate(documentId: number, dateInit: Date, dateEnd: Date): Observable<TransactionResponse[]> {
    let dateInitFormat: string = this.formateDate(dateInit);
    let dateEndFormat: string = this.formateDate(dateEnd);

    const url = `https://ce9b321d-d740-4953-9b3d-bdea0a2a7011.mock.pstmn.io/api/v1/transaction/by-document/${documentId}?date-init=${dateInitFormat}&date-end=${dateEndFormat}`;
    return this.httpClient.get<TransactionResponse[]>(url).pipe(
      catchError(() => {
        console.error('catch error in service');
        return throwError(() => {
          return new Error('No se puedo obtener la data.');
        });
      })
    );
  }

  getTransactionById(id: number): Observable<TransactionResponse> {
    const url = `${this.apiURL}/api/v1/transaction/${id}`;
    return this.httpClient.get<TransactionResponse>(url);
  }

  updateTransaction(
    id: number,
    data: TransactionModel
  ): Observable<TransactionResponse> {
    const url = `${this.apiURL}/api/v1/transaction/${id}`;
    return this.httpClient.put<TransactionResponse>(
      url,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  postTransaction(id: number): Observable<any> {
    const url = `${this.apiURL}/api/v1/transaction/${id}/post`;
    return this.httpClient.put(url, null, this.httpOptions);
  }


  /**
 * Method that brings a list with all seniorsAccounts
 *
 * @return response()
 */
  getAllLedgerAcounts(): Observable<LeaderAccounts[]> {
    return this.httpClient.get<LeaderAccounts[]>(
      this.apiURL + '/api/v1/ledger-accounts'
    );
  }

  /**
   * Method that brings a list with all journal entries
   *
   * @return response()
   */
  getAllJournalEntries(): Observable<any> {
    return this.httpClient
      .get(this.apiURL + '/api/v1/journal-entry')

      .pipe(catchError(this.errorHandler));
  }


  /**
   * Method to create a transaction
   *
   * @return response()
   */
  createTransactionCreditNotes(data: any): Observable<TransactionResponse> {
    return this.httpClient
      .post<TransactionResponse>(
        this.apiURL + '/api/v1/credit-notes',
        JSON.stringify(data),
        this.httpOptions
      )

      .pipe(catchError(this.errorHandler));
  }



  /**
   * Method to create a transaction
   *
   * @return response()
   */
  createTransactionDebitNotes(data: any): Observable<TransactionResponse> {
    return this.httpClient
      .post<TransactionResponse>(
        this.apiURL + '/api/v1/debit-notes',
        JSON.stringify(data),
        this.httpOptions
      )

      .pipe(catchError(this.errorHandler));
  }


  getAllCreditNoteByTrasactionId(id: number): Observable<any[]> {
    const url = `${this.apiURL}/api/v1/credit-notes/by-transaction/${id}`;
    return this.httpClient.get<any[]>(url);
  }

  /**
  * Method that brings a list adjusjentment
  *
  * @return response()
  */
  getAllNotasCredits(): Observable<any> {
    return this.httpClient
      .get(this.apiURL + '/api/v1/credit-notes')

      .pipe(catchError(this.errorHandler));
  }


    /**
  * Method that brings a list adjusjentment
  *
  * @return response()
  */
    getAllNotasDebits(): Observable<any> {
      return this.httpClient
        .get(this.apiURL + '/api/v1/debit-notes')
  
        .pipe(catchError(this.errorHandler));
    }
  

  getNoteCreditById(id: number): Observable<any> {
    const url = `${this.apiURL}/api/v1/credit-notes/${id}`;
    return this.httpClient.get<any>(url);
  }

  getNoteDebitById(id: number): Observable<any> {
    const url = `${this.apiURL}/api/v1/debit-notes/${id}`;
    return this.httpClient.get<any>(url);
  }



  putStatusCreditNotes(id: number): Observable<any> {
    const url = `${this.apiURL}/api/v1/credit-notes/${id}/post`;
    return this.httpClient.put(url, null, this.httpOptions);
  }

  /**
   * Error Handler Method
   *
   * @return response()
   */
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


  formateDate(date: any): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

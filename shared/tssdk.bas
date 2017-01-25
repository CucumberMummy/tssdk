Attribute VB_Name = "Export"
Const dQuotes = """"
Const langCount = 4
Function Langs(index As Long) As String
    Dim result As Variant
    
    result = Array("en", "jp", "tentativelyTranslated", "tranlated")

    Langs = result(index - 1)
End Function

Function QuotesWrap(value As String) As String
    QuotesWrap = dQuotes + value + dQuotes
End Function

Function JSON(key As String, value As String) As String
    JSON = "{" + QuotesWrap(key) + ": " + QuotesWrap(value) + "}"
End Function

Function RubyTag(ruby As String, rt As String) As String
    rt = Replace(rt, dQuotes, "\" + dQuotes)

    RubyTag = "<ruby>" + ruby + "<rt>" + rt + "</rt></ruby>"
End Function

Function SaveToTextFile(fileName As String, data As String) As Integer
    Set fsT = CreateObject("ADODB.Stream")
    fsT.Type = 2
    fsT.Charset = "utf-8"
    fsT.Open

    fsT.WriteText data
    fsT.SaveToFile fileName, 2

    Set fsT = Nothing
    
    SaveToTextFile = 0
End Function

Sub Export()
    Dim fs As Object
    Dim fileName As String
    Dim fileData As String
    Dim level As Long
    
    Set fs = CreateObject("Scripting.FileSystemObject")
    fileName = ActiveWorkbook.Path + "\js\" & fs.GetBaseName(ActiveWorkbook.FullName) + ".js"
    level = 0
    
    Debug.Print ActiveWorkbook.FullName
    Debug.Print fileName

    fileData = "var " + fs.GetBaseName(ActiveWorkbook.FullName) + " = {" + vbCrLf
    
    Dim sheetCount As Long
    sheetCount = ActiveWorkbook.Worksheets.Count
    
    level = level + 1
    Dim i As Long
    For i = 1 To sheetCount
        Dim table As ListObject
        Dim rowCount As Long
        Dim columnCount As Long
        
        Set table = ActiveWorkbook.Sheets(i).ListObjects(1)
        rowCount = table.Range.Rows.Count
        columnCount = table.Range.Columns.Count
        
        fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + ActiveWorkbook.Sheets(i).Name + dQuotes + ": {" + vbCrLf
        
        level = level + 1
        Dim j As Long
        For j = 2 To rowCount
            Dim currentRow As Range
            
            Set currentRow = table.Range.Cells(j, 1).Rows
            
            fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + currentRow.Cells + dQuotes + ": {" + vbCrLf
            
            level = level + 1
            Dim k As Long
            Dim value As String
            For k = 1 To langCount
                fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + Langs(k) + dQuotes + ": "
                
                value = currentRow.Cells(1, table.ListColumns(Langs(k)).index)
                value = Replace(value, dQuotes, "\\" + dQuotes)

                Select Case k
                Case 1  'en
                    fileData = fileData + QuotesWrap(value)
                Case 2  'jp
                    value = RubyTag( _
                        value, _
                        currentRow.Cells(1, table.ListColumns(Langs(k) + "RT").index) _
                        )
                
                    fileData = fileData + QuotesWrap(value)
                Case 3  'tentativelyTranslated
                    fileData = fileData + QuotesWrap(value)
                Case 4  'tranlated
                    fileData = fileData + QuotesWrap(value)
                Case Else
                    fileData = fileData + QuotesWrap("Unknown")
                End Select
                
                 If k < langCount Then
                    fileData = fileData + "," + vbCrLf
                    
                End If
            Next k
            level = level - 1
            
            fileData = fileData + vbCrLf + WorksheetFunction.Rept(vbTab, level) + "}"
            
            If j < rowCount Then
                fileData = fileData + "," + vbCrLf
            End If
        Next j
        level = level - 1
        
        fileData = fileData + vbCrLf + WorksheetFunction.Rept(vbTab, level) + "}"
        
        If i < sheetCount Then
            fileData = fileData + "," + vbCrLf
        End If
    Next i
    level = level - 1

    fileData = fileData + vbCrLf + "};"
    
    Dim temp As Integer
    temp = SaveToTextFile(fileName, fileData)
    
    'MsgBox "Finished"
End Sub


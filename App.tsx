import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard, Pressable } from 'react-native';
import { hp, wp } from './utils';

const App = () => {
  //tab states
  const [tab, setTab] = useState<'Solar' | 'Bank'>('Solar')

  const [kiloWatt, setKiloWatt] = useState('');
  const [rate, setRate] = useState('');
  const [land, setLand] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState({ kiloWatt: '', rate: '', land: '' });
  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [generationPerMonth, setGenerationPerMonth] = useState<number | null>(null);
  const [generationPerYear, setGenerationPerYear] = useState<number | null>(null);
  const [depreciationAmount, setDepreciationAmount] = useState<number | null>(null);
  const [firstYearReturn, setFirstYearReturn] = useState<number | null>(null);
  const [secondYearReturn, setSecondYearReturn]  = useState<number | null>(null);
  const [thirdYearReturn, setThirdYearReturn] = useState<number | null>(null);
  const [fourthYearReturn, setFourthYearReturn] = useState<number | null>(null);
  const [fifthYearReturn, setFifthYearReturn] = useState<number | null>(null);
  const [totalUptoFiveYear, setTotalUptoFiveYear] = useState<number | null>(null);
  const [totalUptoThirtYear, setTotalUptoThirtyYear] = useState<number | null>(null);
  console.log({totalUptoThirtYear, land, result})


  const gst = 13.8
  const generationConstant = 4.5 * 30 * 8.5
  const depriciationConstant = 0.4

  const validateDecimal = (value: string): boolean => {
    const regex = /^\d*\.?\d{0,2}$/; // up to 2 decimal places
    return regex.test(value);
  };

  const handleCalculate = () => {
    Keyboard.dismiss()
    const kw = parseFloat(kiloWatt);
    const r = parseFloat(rate);
    const l = parseFloat(land || '0');

    const newErrors = {
      kiloWatt: '',
      rate: '',
      land: '',
    };

    if (!kiloWatt || isNaN(kw)) {
      newErrors.kiloWatt = 'Please enter a valid kilowatt value';
    }

    if (!rate || isNaN(r)) {
      newErrors.rate = 'Please enter a valid rate';
    }

    if (land && isNaN(l)) {
      newErrors.land = 'Please enter a valid land value';
    }

    setErrors(newErrors);

    if (newErrors.kiloWatt || newErrors.rate || newErrors.land) {
      setResult(null);
      setGstAmount(null);
      setGenerationPerMonth(null);
      setGenerationPerYear(null);
      setDepreciationAmount(null);
      setFirstYearReturn(null);
      setSecondYearReturn(null);
      setThirdYearReturn(null);
      setFourthYearReturn(null);
      setFifthYearReturn(null);
      setTotalUptoFiveYear(null)
      setTotalUptoThirtyYear(null)
      return;
    }
    // const total = (kw * r) + l;
    const total = (kw * r) ;
    const gstVal = (gst / 100) * total;
    const genMonth = generationConstant * kw;
    const genYear = genMonth * 12;
    const depVal = depriciationConstant * total;
    const firstYear = gstVal + genYear + depVal;

    const secondYearDep = (total - depVal) * 0.2;
    const thirdYearDep = (total - depVal - secondYearDep) * 0.2;
    const fourthYearDep = (total - depVal - secondYearDep - thirdYearDep) * 0.2;
    // const fifthYearDep = (total - depVal - secondYearDep - thirdYearDep - fourthYearDep) * 0.2;

    const secondYear = genYear + secondYearDep;
    const thirdYear = genYear + thirdYearDep;
    const fourthYear = genYear + fourthYearDep;
    const fifthYear = genYear;

    console.log({firstYear, secondYear, gst, genYear, depVal})

    setResult(total);
    setGstAmount(gstVal);
    setGenerationPerMonth(genMonth);
    setGenerationPerYear(genYear);
    setDepreciationAmount(depVal);
    setFirstYearReturn(firstYear);
    setSecondYearReturn(secondYear)
    setThirdYearReturn(thirdYear);
    setFourthYearReturn(fourthYear);
    setFifthYearReturn(fifthYear);
    setTotalUptoFiveYear(firstYear + secondYear + thirdYear + fourthYear + fifthYear)
    setTotalUptoThirtyYear(firstYear + secondYear + thirdYear + fourthYear + fifthYear + (genYear * 25))
  };


  const handleChange = (
    value: string,
    setter: (v: string) => void,
    field: 'kiloWatt' | 'rate' | 'land'
  ) => {
    if (value === '' || validateDecimal(value)) {
      setter(value);
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const formatINR = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return '₹0';
    return '₹' + amount.toLocaleString('en-IN', {maximumFractionDigits: 0});
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <Pressable style={[{flex:1, paddingVertical: hp(1)}, tab === 'Solar' && styles.selectedTab]} onPress={() => setTab('Solar')}>
          <Text style={{fontSize: wp(5), color:'black',fontWeight:'bold', textAlign:'center'}}>Solar</Text>
        </Pressable>

        <Pressable style={[{flex:1, paddingVertical: hp(1)}, tab === 'Bank' && styles.selectedTab]} onPress={() => setTab('Bank')}>
          <Text style={{fontSize: wp(5), color:'black',fontWeight:'bold', textAlign:'center' }}>EMI</Text>
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.scrollContainer}>
        {tab==='Solar' && <View style={styles.container}>
          <Text style={styles.title}>Solar Cost Calculator</Text>

          <Text style={styles.label}>KiloWatt</Text>
          <TextInput
            style={styles.input}
            placeholder="Kilowatt"
            value={kiloWatt}
            keyboardType="numeric"
            onChangeText={(text) => handleChange(text, setKiloWatt, 'kiloWatt')}
          />
          {errors.kiloWatt ? <Text style={styles.errorText}>{errors.kiloWatt}</Text> : null}

          <Text style={styles.label}>Rate</Text>
          <TextInput
            style={styles.input}
            placeholder="Rate"
            value={rate}
            keyboardType="numeric"
            onChangeText={(text) => handleChange(text, setRate, 'rate')}
          />
          {errors.rate ? <Text style={styles.errorText}>{errors.rate}</Text> : null}

          <Text style={styles.label}>Land (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Land (optional)"
            value={land}
            keyboardType="numeric"
            onChangeText={(text) => handleChange(text, setLand, 'land')}
          />
          {errors.land ? <Text style={styles.errorText}>{errors.land}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Basic:</Text>
              <Text style={styles.resultValue}>{formatINR(result)}</Text>

              <Text style={styles.resultLabel}>GST (13.8%):</Text>
              <Text style={styles.resultValue}>{formatINR(gstAmount)}</Text>

              <Text style={styles.resultLabel}>Total Cost:</Text>
              <Text style={styles.resultValue}>{formatINR(result + gstAmount)}</Text>

              <Text style={styles.resultLabel}>Total Cost with Land:</Text>
              <Text style={styles.resultValue}>{formatINR(result + gstAmount + Number(land))}</Text>

              <Text style={styles.resultLabel}>Generation/month:</Text>
              <Text style={styles.resultValue}>{formatINR(generationPerMonth)}</Text>

              <Text style={styles.resultLabel}>Generation/year:</Text>
              <Text style={styles.resultValue}>{formatINR(generationPerYear)}</Text>

              <Text style={styles.resultLabel}>Depreciation (40%):</Text>
              <Text style={styles.resultValue}>{formatINR(depreciationAmount)}</Text>

              <Text style={styles.resultLabel}>First Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR(firstYearReturn)}</Text>

              <Text style={styles.resultLabel}>Second Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR(secondYearReturn)}</Text>

              <Text style={styles.resultLabel}>First Year + Second Year Total:</Text>
              <Text style={styles.resultValue}>{formatINR((firstYearReturn ?? 0) + (secondYearReturn ?? 0))}</Text>

              <Text style={styles.resultLabel}>Third Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR(thirdYearReturn)}</Text>

              <Text style={styles.resultLabel}>Forth Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR(fourthYearReturn)}</Text>

              <Text style={styles.resultLabel}>Fifth Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR(fifthYearReturn)}</Text>

              <Text style={styles.resultLabel}>Total Upto 5 year:</Text>
              <Text style={styles.resultValue}>{formatINR(totalUptoFiveYear)}</Text>

              <Text style={styles.resultLabel}>Sixth Year - Thirty Year Return:</Text>
              <Text style={styles.resultValue}>{formatINR((generationPerYear ?? 0) * 25)}</Text>

              <Text style={styles.resultLabel}>Total Earning upto 30 years:</Text>
              <Text style={styles.resultValue}>{formatINR(totalUptoThirtYear)}</Text>

              <Text style={styles.resultLabel}>Land Appreciation doubles in 7.5 years (30 years): </Text>
              <Text style={styles.resultValue}>{formatINR(((Number(land)) ?? 0) * 16)}</Text>

              <Text style={styles.resultLabel}>Total Project Return</Text>
              <Text style={styles.resultValue}>{formatINR(totalUptoThirtYear + Number(land) - result)}</Text>
            </View>
          )}
        </View>}

        {tab === 'Bank' && <View style={styles.container}>
            <Text style={styles.title}>EMI Cost Calculator</Text>
          </View>}
      </ScrollView>
    </View> 
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(10),
  },
  tabContainer: {
    backgroundColor: '#f5f5f5',
    paddingTop: hp(5),
    flexDirection:'row',
    justifyContent:'space-around'
  },
  selectedTab: {
    backgroundColor:'#007AFF'    
  },
  container: {
    flexGrow: 1,
    padding: wp(5),
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(3),
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: hp(6.5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.2),
    fontSize: hp(2),
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: hp(1),
    marginLeft: wp(1),
    fontSize: hp(1.6),
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(2.2),
    fontWeight: '600',
  },
  resultBox: {
    flexDirection: 'row',  // Display results in a row (left to right)
    flexWrap: 'wrap',      // Wrap the content if space is insufficient
    marginTop: hp(3),
    padding: hp(2),
    backgroundColor: '#e6f2ff',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute space evenly
  },
  resultLabel: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#007AFF',
    width: wp(35),  // Ensure labels take up a fixed width for alignment
    marginTop: hp(1),
  },
  label: {
    fontSize: wp(3.2),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp(1),
    marginBottom: hp(0.3)
  },
  resultValue: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#007AFF',
    marginTop: hp(1),
    width: wp(40),  // Ensure values take up fixed width
    textAlign: 'center', // Center-align the result values
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    marginVertical: hp(0.5),
  },
});


export default App;
